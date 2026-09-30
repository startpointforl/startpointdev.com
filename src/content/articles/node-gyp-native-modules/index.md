---
title: "Ещё немного про нативные модули в Node.js"
description: "На прошлой неделе я выступала с докладом о нативных модулях Node.js — как они устроены, зачем нужны и в каких случаях стоит использовать C++ рядом с JavaScript, а в каких нет."
date: 2025-10-27
slug: node-gyp-native-modules
telegraph: https://telegra.ph/more-node-gyp-10-22
---

## Введение

На прошлой неделе я выступала с докладом о нативных модулях Node.js — как они устроены, зачем нужны и в каких случаях стоит использовать C++ рядом с JavaScript, а в каких нет. Материалы доклада можно посмотреть [в этом посте](https://t.me/startpoint_dev/183).

А здесь мне хочется чуть подробнее раскрыть несколько тем, которые не вошли в презентацию. В частности, подробнее разберём, как связываются окружения Node.js и C++, как обрабатываются исключения в нативных модулях, какие команды отвечают за компиляцию и как безопасно работать с памятью.

## Связь между Node.js и C++

При создании нативных модулей для Node.js важно понимать, как организована связь между JavaScript-окружением и кодом на C++. Эти два мира должны обмениваться данными, и от того, насколько стабильно реализовано это взаимодействие, зависит надёжность и поддерживаемость модуля.

Рассмотрим простую **хеширующую функцию djb2\_hash**, которую реализуем в четырёх вариантах:

- с использованием прямых импортов,
- библиотеки nan,
- интерфейса napi
- и библиотеки node-addon-api.

Полные версии всех примеров доступны в репозитории в [/simple-examples](https://github.com/startpointforl/native-addons-materials/tree/main/simple-examples).

Изначально связь между C++ и Node.js реализовывалась напрямую: в код импортировались классы и функции из библиотек **V8**, **libuv** и самого **Node.js**. Такой подход позволял работать с низкоуровневыми сущностями вроде Number, String и Array, но создавал жёсткую зависимость от версий. Например, обновление движка часто приводило к несовместимости кода.

```cpp
#include <node.h>
#include <v8.h>
#include <string>

namespace hasher {
    using v8::Context;
    using v8::Exception;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    unsigned long djb2_hash(const char* str) {
        ...
    }

    void Hash(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();
        
        if (args.Length() < 1) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8Literal(isolate, "Нужен 1 аргумент")));
            return;
        }
        
        if (!args[0]->IsString()) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8Literal(isolate, "Аргумент должен быть строкой")));
            return;
        }
        
        String::Utf8Value input(isolate, args[0]);
        unsigned long hash_result = djb2_hash(*input);
        
        args.GetReturnValue().Set(Number::New(isolate, hash_result));
    }

    void Init(Local<Object> exports) {
        NODE_SET_METHOD(exports, "hash", Hash);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
}
```

Чтобы снизить зависимость от конкретных реализаций, появилась библиотека **nan (Native Abstractions for Node.js)**. Она добавила прослойку между разработчиком и движком, позволяя писать код без прямого обращения к API V8. Благодаря этому структура модуля стала чище, а совместимость — выше.

```cpp
#include <nan.h>
...

NAN_METHOD(hash) {
    if (info.Length() < 1) {
        Nan::ThrowTypeError("Нужен 1 аргумент");
        return;
    }
    
    if (!info[0]->IsString()) {
        Nan::ThrowTypeError("Аргумент должен быть строкой");
        return;
    }
    
    Nan::Utf8String input(info[0]);
    unsigned long hash_result = djb2_hash(*input);
    
    info.GetReturnValue().Set(Nan::New<v8::Number>(hash_result));
}

NAN_MODULE_INIT(Init) {
    NAN_EXPORT(target, hash);
}

NODE_MODULE(hasher, Init)
```

Тем не менее, стабильность по-прежнему оставалась проблемой. Разные версии Node.js меняли внутренний API, и это приводило к необходимости постоянных доработок. Для решения этой задачи был создан **napi** — стабильный интерфейс на языке C, независимый от версии Node.js.

Однако синтаксис napi достаточно громоздкий. Даже создание простого числа требует вызова napi\_create\_double, проверки возвращаемого статуса и обработки ошибок

```cpp
#include <node_api.h>
...

napi_value Hash(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 1;
    napi_value argv[1];
    napi_value result;
    
    status = napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Ошибка получения аргументов");
        return nullptr;
    }
    
    if (argc < 1) {
        napi_throw_type_error(env, nullptr, "Нужен 1 аргумент");
        return nullptr;
    }
    
    napi_valuetype valuetype;
    status = napi_typeof(env, argv[0], &valuetype);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Ошибка проверки типа");
        return nullptr;
    }
    
    if (valuetype != napi_string) {
        napi_throw_type_error(env, nullptr, "Аргумент должен быть строкой");
        return nullptr;
    }
    
    size_t str_size;
    status = napi_get_value_string_utf8(env, argv[0], nullptr, 0, &str_size);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Ошибка получения размера строки");
        return nullptr;
    }
    
    char* input = new char[str_size + 1];
    size_t copied;
    status = napi_get_value_string_utf8(env, argv[0], input, str_size + 1, &copied);
    if (status != napi_ok) {
        delete[] input;
        napi_throw_error(env, nullptr, "Ошибка получения строки");
        return nullptr;
    }
    
    unsigned long hash_result = djb2_hash(input);
    delete[] input;
    
    status = napi_create_double(env, static_cast<double>(hash_result), &result);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Ошибка создания результата");
        return nullptr;
    }
    
    return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;
    
    status = napi_create_function(env, nullptr, 0, Hash, nullptr, &fn);
    if (status != napi_ok) return nullptr;
    
    status = napi_set_named_property(env, exports, "hash", fn);
    if (status != napi_ok) return nullptr;
    
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

Чтобы сделать разработку на C++ удобнее, появилась библиотека **node-addon-api** — обёртка над napi, которая предоставляет современный объектно-ориентированный интерфейс.

```cpp
#include <napi.h>
...

Napi::Number Hash(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1) {
        Napi::TypeError::New(env, "Нужен 1 аргумент").ThrowAsJavaScriptException();
        return Napi::Number::New(env, 0);
    }
    
    if (!info[0].IsString()) {
        Napi::TypeError::New(env, "Аргумент должен быть строкой").ThrowAsJavaScriptException();
        return Napi::Number::New(env, 0);
    }
    
    std::string input = info[0].As<Napi::String>().Utf8Value();
    unsigned long hash_result = djb2_hash(input.c_str());
    
    return Napi::Number::New(env, hash_result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "hash"), Napi::Function::New(env, Hash));
    return exports;
}

NODE_API_MODULE(hasher, Init)
```

## Работа с исключениями в нативных модулях

На текущий момент существует два основных подхода к написанию нативных модулей: **napi**, если используется язык C, и **node-addon-api**, если проект реализуется на C++. Оба варианта позволяют работать с исключениями, но каждый из них имеет собственную специфику.

> Исключение (exception) — это контролируемая ошибка, возникающая в ходе выполнения программы. Как правило, она используется для сигнализации о некорректных ситуациях, например, при неудачной валидации данных или ошибке вычислений.

Существует два фундаментальных подхода к обработке ошибок, в частности в Node.js и в нативных модулях:

1. **Выбрасывать исключение** с помощью `throw` в том месте, где ошибка произошла. Далее оно перехватывается с помощью конструкции `try…catch`, либо в текущем контексте, либо в вызывающем коде.
2. **Возвращать код ошибки или статус**, не выбрасывая исключение. В этом случае метод возвращает объект, содержащий, например, поля `error` и `data`, где `error` указывает на успешность операции.

Внутренние компоненты Node.js (включая его код на C++) используют преимущественно второй подход — возврат кода ошибки. Соответственно, по умолчанию именно этот способ применяется и при написании нативных модулей внутри самих этих модулей.

Рассмотрим простую функцию деления чисел с проверкой входных данных. Если делитель равен нулю, будет возвращён код ошибки.

Полные версии всех примеров доступны в репозитории в [/error-handlers](https://github.com/startpointforl/native-addons-materials/tree/main/error-handlers).

```cpp
#include <node_api.h>

napi_value NapiDivide(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 2;
    napi_value args[2];
    napi_value result;
    
    status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
    if (status != napi_ok) return nullptr;
    
    if (argc < 2) {
        napi_throw_error(env, nullptr, "Требуется два аргумента");
        return nullptr;
    }
    
    double a, b;
    status = napi_get_value_double(env, args[0], &a);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Первый аргумент должен быть числом");
        return nullptr;
    }
    
    status = napi_get_value_double(env, args[1], &b);
    if (status != napi_ok) {
        napi_throw_error(env, nullptr, "Второй аргумент должен быть числом");
        return nullptr;
    }
    
    if (b == 0) {
        napi_throw_error(env, nullptr, "Деление на ноль");
        return nullptr;
    }
    
    status = napi_create_double(env, a / b, &result);
    if (status != napi_ok) return nullptr;
    
    return result;
}
```

При этом мы используем специальный метод `napi_throw_error`, чтобы вернуть исключение в окружение Node.js. Поэтому, используя этот модуль у себя в js-коде, мы в любом случае должны отловить исключение с помощью `try…catch`.

```js
const divider = require('./build/Release/divider');
try {
    console.log(divider.divide(10, 0));
} catch (error) {
    console.log('Error: ', error.message);
}
```

Однако при необходимости можно реализовать работу через исключения и внутри самого кода модуля. По умолчанию Node.js компилирует свои внутренние компоненты с флагами, запрещающими использование `throw` в коде C++. Если оставить `throw` в коде нативного модуля без переопределения этих флагов, компиляция завершится ошибкой.

```cpp
../divider.cpp:13:32: error: cannot use 'throw' with exceptions disabled
   13 |         if (status != napi_ok) throw std::runtime_error("Ошибка получения аргументов");
```

Чтобы разрешить использование исключений, необходимо переопределить соответствующие флаги компиляции в binding.gyp:

```json
{
  "targets": [
    { 
      ...,
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
      },
      "msvs_settings": {
        "VCCLCompilerTool": { 
          "ExceptionHandling": 1 
        }
      },
      ...
    }
  ]
}
```

В случае с **node-addon-api** принцип остаётся тем же, но в конфигурацию также добавляется отдельный флаг, который определяет стратегию обработки ошибок. Он может принимать одно из двух значений:

- `NODE_ADDON_API_DISABLE_CPP_EXCEPTIONS` (или `NAPI_DISABLE_CPP_EXCEPTIONS`) — исключения на уровне C++ отключены (используется возврат ошибок).
- `NODE_ADDON_API_CPP_EXCEPTIONS` — исключения разрешены.

Если флаг не определить вовсе, компиляция также завершится ошибкой.

```
/napi.h:63:2: error: Exception support not detected.
Define either NODE_ADDON_API_CPP_EXCEPTIONS or NODE_ADDON_API_DISABLE_CPP_EXCEPTIONS.
```

При использовании исключений через throw для node-addon-api нужно не только определить флаг `NODE_ADDON_API_CPP_EXCEPTIONS`, но и переопределить те же флаги компиляции, что и в случае с napi.

```json
{
  "targets": [
    { 
      ...,
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
      },
      "msvs_settings": {
        "VCCLCompilerTool": { 
          "ExceptionHandling": 1 
        }
      },
      "defines": [ "NODE_ADDON_API_CPP_EXCEPTIONS" ],
      ...
    }
  ]
}
```

## Компиляция нативных модулей

После того как реализована логика модуля и настроена обработка ошибок, следующий шаг — его компиляция. В экосистеме Node.js существует несколько способов собрать нативный модуль, и у каждого есть свои особенности.

Компиляция может выполняться **явно** — через прямой вызов `node-gyp`, или **неявно** — при установке зависимостей через `npm`.

## Явная компиляция

Основные команды для сборки модулей — **`node-gyp build`** и **`node-gyp rebuild`**.

Обе выполняют процесс компиляции, но с разными сценариями:

- `node-gyp build` компилирует модуль, если исходники или конфигурация изменились.
- `node-gyp rebuild` выполняет полную пересборку независимо от состояния артефактов, удаляя предыдущие результаты сборки.

Если запустить эти команды напрямую из терминала, возможно сообщение об ошибке, что `node-gyp` не найден. Это связано с тем, что утилита не находится в системной переменной окружения `PATH`. Добавлять её вручную необязательно: достаточно указать команды внутри секции **`scripts`** в `package.json`:

```
"scripts": {
  "build": "node-gyp build",
  "rebuild": "node-gyp rebuild"
}
```

В таком случае команда будет выполняться корректно даже без добавления `node-gyp` в `PATH`.

Также `node-gyp` поддерживает параметр `--directory`, который позволяет указать путь к каталогу, где находится `binding.gyp`. Это удобно при организации проекта с несколькими нативными компонентами.

## Неявная компиляция

Помимо прямого вызова, компиляция может выполняться автоматически при работе с пакетным менеджером.

Первый случай — выполнение команды **`npm install`**.

- При **первом запуске** `npm install` происходит компиляция как корневого нативного модуля (если в корне проекта есть файл `binding.gyp`), так и всех зависимостей в `node_modules`, которые содержат собственные нативные модули.
- При **повторном запуске** `npm install` пересобирается только корневой модуль, а зависимости не перекомпилируются.

Другой вариант неявной компиляции — команда **`npm rebuild`**. Она выполняет пересборку не только корневого модуля, но и всех зависимостей в `node_modules`, содержащих нативный код. Это полезно, если изменились настройки системы, версии библиотек или компилятора, и требуется собрать бинарные файлы заново.

## Отключение автоматической сборки

По умолчанию `npm install` инициирует компиляцию, если в проекте есть `binding.gyp`. Однако иногда необходимо пропустить этот шаг — например, вы устанавливаете новую зависимость в ваш проект, где корневой нативный модуль ещё не готов. В таком случае можно использовать флаг **`--ignore-scripts`**:

```bash
npm install --ignore-scripts
```

При этом все этапы сборки, включая компиляцию нативных модулей, будут пропущены.

## Кроссплатформенная компиляция

По умолчанию нативные модули компилируются **непосредственно на той платформе**, где выполняется установка. Это значит, что бинарные файлы создаются отдельно для Windows, Linux или macOS, и при переносе проекта между системами потребуется новая сборка.

Избежать этого можно с помощью инструментов, которые позволяют заранее собрать бинарные файлы под разные архитектуры и распространять их вместе с пакетом. При установке такие файлы просто загружаются, а не пересобираются локально.

Для этой задачи существует несколько подходов:

- **prebuild** — старая утилита, которая собирала бинарные файлы под разные платформы и архитектуры и загружала их на GitHub.
- **prebuild-install** — парная библиотека, которая скачивала эти бинарники при установке пакета. Если подходящий артефакт не был найден, она вызывала `node-gyp rebuild`. В своё время это упрощало установку, но зависело от сети и GitHub.
- **prebuildify** — современная альтернатива `prebuild`. Она тоже создаёт предсобранные бинарники, но сохраняет их внутри самого пакета (в папке `/prebuilds/`), без необходимости что-то загружать или скачивать.
- **node-gyp-build** — минималистичная runtime-библиотека, которая при запуске модуля автоматически выбирает и подключает нужный бинарник из `/prebuilds/`. Если подходящего нет — только тогда выполняется локальная сборка.

Использование `prebuildify` и `node-gyp-build` может сделать установку нативных модулей независимой от среды, в которой выполняется установка.

## Работа с памятью в нативных модулях

Как я упоминала в своём докладе, одним из наиболее критичных аспектов при разработке нативных модулей является управление памятью. В отличие от JavaScript, где памятью управляет сборщик мусора V8, в коде C++ ответственность за выделение и освобождение ресурсов лежит на разработчике. Ошибки на этом уровне приводят к утечкам памяти и росту потребления ресурсов.

Чтобы посмотреть, как разные подходы к работе с памятью влияют на поведение приложения, рассмотрим несколько примеров. Каждый из них реализует простую обработку данных, но различается способом выделения и управления памятью.

Полные версии всех примеров доступны в репозитории в [/memory-examples](https://github.com/startpointforl/native-addons-materials/tree/main/memory-examples).

## Работа с JS-массивом

Начнём с обработки обычного JavaScript-массива. Для вычислений элементы копируются из JS-масссива в нативный массив C++, затем обратно — в новый JS-массив.

```cpp
Napi::Value ProcessArray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsArray()) {
        Napi::TypeError::New(env, "Array expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    Napi::Array input = info[0].As<Napi::Array>();
    uint32_t length = input.Length();
    
    int* data = new int[length];
    
    // копируем первый раз
    for (uint32_t i = 0; i < length; i++) {
        Napi::Value val = input[i];
        data[i] = val.As<Napi::Number>().Int32Value();
    }
    
    for (uint32_t i = 0; i < length; i++) {
        data[i] = data[i] * 2;
    }
    
    // копируем второй раз
    Napi::Array result = Napi::Array::New(env, length);
    for (uint32_t i = 0; i < length; i++) {
        result[i] = Napi::Number::New(env, data[i]);
    }
    
    delete[] data;
    
    return result
```

Такой подход прост, но неэффективен: данные копируются дважды, что увеличивает нагрузку на heap и приводит к росту потребления памяти. Метрики также покажут увеличение `heapUsed` после серии вызовов и частичное освобождение только после принудительного вызова GC.

## Обработка Buffer без копирования

Следующий вариант — использование **Buffer**, который предоставляет прямой доступ к участку памяти. В этом случае данные обрабатываются *in-place*, без промежуточных копий.

```cpp
Napi::Value ProcessBuffer(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsBuffer()) {
        Napi::TypeError::New(env, "Buffer expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    // берём данные напрямую
    Napi::Buffer<int32_t> buffer = info[0].As<Napi::Buffer<int32_t>>();
    int32_t* data = buffer.Data();
    size_t length = buffer.Length() / sizeof(int32_t);
    
    for (size_t i = 0; i < length; i++) {
        data[i] = data[i] * 2;
    }
    
    return Napi::String::New(env, "Buffer processed in-place");
}
```

Подход zero-copy позволяет обрабатывать большие объёмы данных с минимальными накладными расходами: значения `rss` и `heapUsed` практически не меняются при многократных вызовах. Такой способ оптимален для задач, где требуется высокая производительность и стабильное использование памяти.

## Внешняя память и финализаторы

Более продвинутый вариант — создание **External Buffer**, где память выделяется в C++ и управляется вручную. При этом JavaScript-объект `Buffer` выступает лишь обёрткой над участком памяти, а освобождение происходит через финализатор, вызываемый сборщиком мусора.

```cpp
void FinalizeExternalBuffer(Napi::Env env, int32_t* data) {
    delete[] data;
    std::printf("🗑️  Finalizer called: buffer memory freed\\n");
}

Napi::Value CreateExternalBuffer(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    int32_t size = info[0].As<Napi::Number>().Int32Value();
    
    int32_t* data = new int32_t[size];
    
    for (int32_t i = 0; i < size; i++) {
        data[i] = i * 3;
    }
    
    // создаём буффер на основе памяти в C++
    return Napi::Buffer<int32_t>::New(
        env,
        data,
        size,
        FinalizeExternalBuffer
    );
}
```

В метриках будет видно, что поле `external` резко возрастает, отражая объём памяти, управляемой C++. Однако освобождение этой памяти происходит не сразу. Для корректного завершения нам требуется **два цикла GC**: первый помечает объекты для удаления и планирует вызов финализаторов, второй — выполняет их и реально освобождает ресурсы.

```js
const addon = require('../build/Release/addon');
....

// Создаем 50 буферов и храним ссылки на них
const buffers = [];
for (let i = 0; i < 50; i++) {
    buffers.push(addon.createExternalBuffer(SIZE));
}
...
// Очищаем ссылки на буферы
buffers.length = 0;
...

// Вызываем GC - память отмечается для удаления
if (global.gc) {
    global.gc();
}
console.log('After second GC:', formatMemory(process.memoryUsage()));
/*
After second GC: {
  ...
  external: '192.16 MB'
}
*/

// Еще один GC для физического освобождения памяти
if (global.gc) {
    global.gc();
}
console.log('After third GC:', formatMemory(process.memoryUsage()));
/*
After third GC: {
  ...
  external: '1.42 MB'
}
🗑️  Finalizer called: buffer memory freed (x50)
*/
```

Этот механизм обеспечивает точный контроль над памятью, но требует внимательности: если ссылки на объекты остаются, сборщик мусора не сможет освободить внешнюю память.

## Правильное выделения памяти VS утечки памяти

Посмотрим на два противоположных примера: корректное выделение памяти и намеренная утечка.

```cpp
Napi::Value SimpleAllocation(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    int size = info[0].As<Napi::Number>().Int32Value();
    
    // выделяем память
    int* data = new int[size];
    
    for (int i = 0; i < size; i++) {
        data[i] = i * i;
    }
    
    Napi::Array result = Napi::Array::New(env, size);
    for (int i = 0; i < size; i++) {
        result[i] = Napi::Number::New(env, data[i]);
    }
    
    // здесь память очищается после использования
    delete[] data;
    
    return result;
}
Before: {
  rss: '41.80 MB',
  ...
}
After 50 calls: {
  rss: '86.89 MB',
  ...
}
```

В первом случае память выделяется с помощью `new[]` и освобождается через `delete[]`. После завершения функции использование памяти уменьшается.

```cpp
Napi::Value AllocationWithLeak(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    int size = info[0].As<Napi::Number>().Int32Value();
    
    // выделяем память
    int* data = new int[size];
    
    for (int i = 0; i < size; i++) {
        data[i] = i * i;
    }
    
    Napi::Array result = Napi::Array::New(env, size);
    for (int i = 0; i < size; i++) {
        result[i] = Napi::Number::New(env, data[i]);
    }
    
    return result;
}
```

Во втором случае оператор `delete[]` отсутствует, и выделенная память остаётся занятой. В результате показатель `rss` растёт с каждым вызовом и не очищается даже после вызова GC.

```
Before: {
  rss: '42.00 MB',
  ...
}
After 50 calls: {
  rss: '271.00 MB',
  ...
}
After GC: {
  rss: '265.47 MB',
  ...
}
```

## Заключение

В этой статье мы рассмотрели ключевые аспекты, которые важно знать при работе с нативными модулями: от слоёв взаимодействия Node.js и C++ до механизмов обработки ошибок, компиляции и управления памятью.

Эти детали редко попадают в доклады — но они помогают глубже понимать, что происходит «под капотом» и как можно сделать код стабильным и производительным.

Если вам интересны подобные разборы, подписывайтесь на мой [Telegram-канал](https://t.me/startpoint_dev) — там уже есть серии статей о **V8**, **libuv** и **Event Loop** в Node.js, а впереди будут новые материалы, эксперименты и анонсы следующих докладов.
