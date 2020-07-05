
[English](https://github.com/mr-amirka/minimalist-notation/blob/master/docs.md)


# Minimalist Notation Docs



* [About](#about)  
    * [Example for class name](#example-for-class-name)   
    * [Example for attr](#example-for-attr)  
* [Notation](#notation)  
    * [Имя эссенции](#Имя-эссенции)  
    * [Контекст эссенции](#Контекст-эссенции)  
    * [Медиа-запросы в нотации](#Медиа-запросы-в-нотации)  
    * [Grouping](#grouping)  
    * [Media-queries generation](#media-queries-generation)  
    * [Escaping](#escaping)  
    * [Essences of styles](#essences-of-styles)  
    * [Dynamic essences](#dynamic-essences)  
    * [Generating the essences of styles](#generating-the-essences-of-styles)  
    * [States](#states)  
    * [Auto prefixes](#auto-prefixes)  
    * [Parent/child selectors](#parent/child-selectors)  
    * [Depth](#depth)  
    * [Complex selectors](#complex-selectors)  
    * [Essences assignment (Example with container)](#essences-assignment)  
    * [Priority multiplier](#priority-multiplier)  






* [Getting started](https://github.com/mr-amirka/minimalist-notation/blob/master/README-ru.md)  
* [Предустановленные опции](https://github.com/mr-amirka/minimalist-notation/presets/blob/master/README.md)  
* [От автора](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author-ru.md)  


Try this tests:  

* https://jsfiddle.net/Amirka/dkozgauy/  
* https://jsfiddle.net/Amirka/0475wbq2/  


Home page: https://minimalist-notation.org  


Буду благодарен за Ваши отзывы и замечания. Пишите мне в [telegram](https://t.me/mr_amirka) .  
С любовью, Ваш mr.Amirka :)


Вы заинтересованы в развитии проекта? Внесите свою [лепту](https://yasobe.ru/na/notation).



## About


Minimalist Notation (MN) (минималистическая нотация) - это технология генерации стилей, основанная на парсинге разметки. Генерация осуществляется непосредственно в СSS. Технология колоссально ускоряет процесс верстки и может использоваться дополнительно с традиционными технологиями, либо заменять их полностью.  

Преимущество перед традиционными технологиями CSS-препроцессинга в том, что разработчик избавляется от необходимости писать CSS. CSS генерируется автоматически на основании нотации и заданных разработчиком правил генерации стилей. Разработчику больше не нужно контролировать, какие стили используются в его разметке, а какие - нет, ибо отныне стили генерируются только для того, что присутствует в разметке.


PS:   
Технология ориентирована на методологию Functional/Atomic CSS.

Если Вы верстаете по методологии Functional/Atomic CSS, то:  

* со временем Вы с первого взгляда понимаете смысл каждого имени в разметке;
* имеете возможность легко стандартизировать правила нотации и именования;
* разметку легко переиспользовать в новом проекте, если он предусматривает тот же базовый набор функциональных стилей в CSS.
* в случае внесения правок в дизайн, Вы будете менять только HTML-разметку.
* у Вас прямые руки - Вы не натыкаетесь на грабли с перекрытиями стилей;
* имеете возможность настроить Вашу систему сборки под автоматическую генерацию CSS из атрибутов в разметке;
* не задаете громоздкие атрибуты длинным селекторам в каждом месте, где хотите, например, просто добавить плавность трансформации. В функциональном подходе это делается один раз, как в CSS-коде ниже:

```css
.dn250 {
  -khtml-transition-duration: 250ms;
  -ms-transition-duration: 250ms;
  -o-transition-duration: 250ms;
  -moz-transition-duration: 250ms;
  -webkit-transition-duration: 250ms;
  transition-duration: 250ms;
}
```   


Благодаря MN:  

* **ноль CSS-кода и CSS-файлов** в проекте. Абсолютно нет необходимости писать CSS-код.
* СSS генерируется автоматически из значений атрибутов в разметке, и мы экономим время, избавив себя от написания "сатаниского" CSS-кода;
* нет мертвого CSS-кода, ибо CSS генерируется только для той разметки, которая имеется.
* в runtime версии мы имеем возможность не обращаться на сервер за "тяжелыми" СSS-файлами.
* при внесении правок в дизайн мы меняем только разметку HTML, не трогая СSS.

Технология "Minimalist Notation" поддерживает:  

* параметризуемую нотацию имен
* параметризуемые состояния;
* контексты родительских/дочерних селекторов;
* контексты комплексных селекторов;
* управление глубиной в dom-дереве через нотацию;
* управление приоритетом стилей через нотацию;
* контексты медиа-запросов;
* группировки подстрок в нотации;
* синонимы состояний и медиа-запросов;
* наследование от эссенций стилей (расширение; аналог ``` @extend ``` в SASS) ;
* примеси эссенций (аналог ``` @include ``` в SASS);
* ассоциацию селекторов с эссенциями стилей;
* манипуляция глобальными стилями CSS в рантайме.


Для целей кастомизации стилей разметки под определенную тему в MN предусмотрена возможность манипуляции глобальными CSS правилами в рантайме, например, так для эссенций:
```js
mn('bgTheme', {
  style: {
    backgroundColor: '#EEE',
    borderColor: '#CCC',
  },
});
```
или путем расширения эссенции за счет других эссенций:
```js
mn('bgTheme', {
  exts: 'bgE cC',
});

// shorter way
mn('bgTheme', 'bgE cC');
```

или так только для конкретных селекторов без интеграции в нотацию:
```js
mn.css('.bgTheme', {
  backgroundColor: '#EEE',
  borderColor: '#CCC',
});
```

или путем ассоциации селекторов с эссенциями стилей:
```js
mn.assign({
  '.bgTheme': 'bgE cC',
});
```

PS: Если необходимо задать несколько альтернативных значений для одного атрибута по аналогии с оным в CSS:
```css
.bgTheme {
  background-color: #CCC;
  background-color: rgba(0,0,0,0.2);
}
```
Вы можете сделать так:
```js
mn.css('.bgTheme', {
  backgroundColor: ['#CCC',  'rgba(0,0,0,0.2)']
});
```


### Example for class name

Input:

```html
<div class="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```css
@media mediaName{
  .c0F0\@mediaName{color:rgb(0,255,0)}
}
.f12{font-size:12px}
.f14\:h:hover{font-size:14px}
.parent .cF00\<\.parent{color:rgb(255,0,0)}
.bg0F0{background:rgb(0,255,0)}
.sq40{width:40px;height:40px}
.p10{padding:10px}
.mb10{margin-bottom:10px}

```


### Example for attr "m"

Input:

```html
<div m-n="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```css
@media mediaName{
  [m-n~='c0F0@mediaName']{color:rgb(0,255,0)}
}
[m-n~='f12']{font-size:12px}
[m-n~='f14:h']:hover{font-size:14px}
.parent [m-n~='cF00<.parent']{color:rgb(255,0,0)}
[m-n~='bg0F0']{background:rgb(0,255,0)}
[m-n~='sq40']{width:40px;height:40px}
[m-n~='p10']{padding:10px}
[m-n~='mb10']{margin-bottom:10px}

```


## Notation

Base format:  
```
{property}{value}@{mediaName}[...(>{depth}{childSelectors}|<{depth}{parentSelectors})@{mediaName}]*{priority}
```


Запись нотации MN делится на 2 части:  

* имя эссенции;
* контекст эссенции (комбинированный селектор и медиа-запрос).

За имя эссенции отвечает подстрока от начала имени до первого служебного символа (``` <>.[]:+@ ```).

Остальная часть нотации, включая первый служебный символ относится к контексту эссенции, в пределах которого стили эссенции применяются (селекторы и медиа-запросы).  Например:  

Example 1:  

``` ph10>1 ``` ->  
 имя эссенции: ``` ph10 ```;  контекст эссенции: ``` >1 ```

Example 2:  
``` bgF00<.theme-1 ``` ->  
 имя эссенции: ``` bgF00 ``` ;  контекст эссенции: ``` <.theme-1 ```

Example 3:  
``` cF:h  ``` ->   
имя эссенции: ``` cF ```;  контекст эссенции: ``` :h ```

Example 4:  
``` mh-10@m>1  ``` ->   
имя эссенции: ``` mh-10 ```;  контекст эссенции: ``` @m>1 ```


### Имя эссенции

Часть имени, которая отвечает за эссенцию, парсится для генерации стилей и также делится на 2 части:
* префикс эссенции (статичная часть, собственно само имя эссенции);
* суффикс эссенции (параметризуемая часть, значение эссенции).

Префиксом имени эссенции является первая часть имени эссенции, состоящая из латинских букв в нижнем регистре. Оно может являться аббревиатурой. Соответственно, остальная часть имени эссенции является префиксом - параметризуемой частью. Например:  

Example 1:  
``` ph10 ``` ->  
префикс эссенции: ``` ph ```;  суффикс эссенции: ```10 ```

Example 2:  
``` bgF00 ``` ->  
префикс эссенции: ``` bg ```;  суффикс эссенции: ``` F00 ```

Example 3:  
``` cF  ``` ->   
префикс эссенции: ``` c ```;  суффикс эссенции: ``` F ```


### Контекст эссенции

Часть нотации, отвечающая за контекст эссенции может разделяться символом ``` > ``` на несколько частей, представляющие собой последовательность дочерних элементов до целевого элемента, на который распространяется влияние эссенции. Например:  
``` essenceValue>.child1>.child2>.targetChild ```


Затем полученные части могут разделяться символом ``` < ``` на несколько частей представляющие собой последовательность родительских элементов, при наличии которых стили эссенции вступают в силу. Например:  
``` essenceValue<.parent1<.parent2 ```


### Медиа-запросы в нотации


Каждая полученная выше часть может разделяться символом ``` @ ```, отвечающий за имя медиа-запроса, при наличии которого стили эссенции вступают в силу. Например:  
``` essenceValue@mediaName ```  
``` essenceValue@mediaName<.parent ```  
``` essenceValue<.parent@mediaName ```  
``` essenceValue@mediaName>.targetChild ```  
``` essenceValue<.parent1@mediaName<.parent2 ```  
``` essenceValue@mediaName<.parent1<.parent2>.child1>.targetChild ```  

Допустимо указывать имена нескольких медиа-запросов, например так:

``` essenceValue@mediaName1<parent@mediaName2 ```

Однако в подобных случаях задействуется только первое найденное имя медиа-запроса. В данном случае, это ``` mediaName1 ```

Таким образом сделано для удобства использования нотации, например в случаях, когда мы задаем общий медиа-запрос для нескольких атрибутов дочернего элемента, но для некоторых атрибутов этот медиа-запрос должен отличаться:
```html
<div m-n="(sq200|f20|f14@m)>.child1@d">
  <div class="child1">
    текст
  </div>
</div>
```


Нотация ``` (sq200|f20|f14@m)>.child1@d ``` распарсится как несколько таких строк:

1. ``` sq200>.child1@d ```  
2. ``` f20>.child1@d ```  
3. ``` f14@m>.child1@d ```  

В строке *3* мы получим несколько имен медиа-запросов, но в силу вступит только первое имя медиа-запроса в этой последовательности.



### Grouping

Группировка помогает сократить запись.

Несколько параметров можно сгруппировать вместе с помощью разделителя ``` | ``` между альтернативными подстроками внутри скобок.


Example:

Вместо этого
```html
<div m-n="bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a"></div>
```
Вы можете сделать так:
```html
<div m-n="(bc00F|bg0)>input:(h|a)"></div>
```

Т.е., эти записи эквивалентны:  
Example 1:  
``` (bc00F|bg0)>input ```  ->  ``` bc00F>input bg0>input ```  

Example 2:  
``` input:(h|a) ``` ->  ``` input:h input:a ```  

Example 3:
``` (bc00F|bg0)>input:(h|a) ```  ->  ``` bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a ```




### Escaping

В процессе применения MN могут возникать ситуации, когда Вам нужно экранировать служебные символы, например в таком случае:
```html
<div m-n="pt33.3%"></div>
```
Мы получим не то, чего ожидаем, так как точка является служебным символом
``` pt33.3%  ```  ->  
```css
[m-n~='pt33.3%'].3%{padding-top:33px}
```


Если мы хотим, чтобы точка попала в параметры эссенции, то мы должны экранировать её так:
```html
<div m-n="pt33\.3%"></div>
```
Таким образом, получим желаемое:
``` pt33\.3% ``` ->  
```css
[m-n~='pt33\\.3%']{padding-top:33.3%}
```



### Media-queries generation  


По умолчанию имя медиа-запроса генерируется в CSS как есть, например:  
INPUT:  
```html
<div m-n="f20@m f10@print">текст</div>
```  

OUTPUT:  
```css
@media m {
  [m-n~='f20@m'] {
    font-size: 20px;
  }
}
@media print {
  [m-n~='f10@print'] {
    font-size: 10px;
  }
}
```


Именам медиа-запросов в нотации можно установить синонимы.  
Пример:  
INPUT:  
```js
mn.media.m = {
  query: '(max-width: 991px)',
  priority: 0
};
mn.media.m2 = {
  query: '(max-width: 767px)',
  priority: 1
};
```  

```html
<div m-n="f18@m f16@m2">текст</div>
```  

OUTPUT:  

```css
@media (max-width: 991px) {
  [m-n~='f18@m'] {
    font-size: 18px;
  }
}
@media (max-width: 767px) {
  [m-n~='f16@m2'] {
    font-size: 16px;
  }
}
```



Если в имени медиа-запроса будет распознана сокращенная запись подпадающая под шаблон:
```
{min-width?:number}-{max-width?:number}x{min-height?:number}-{max-height?:number}^{media-priority?:number}
```

Тогда будут сгенерированы соответствующие медиа-запросы, например:  
INPUT:  
```html
<div m-n="f20@768-992x300-600^2">текст</div>
```  

OUTPUT:  
```css
@media (min-width: 768px) and (max-width: 992px) and (min-height: 300px) and (max-height: 600px) {
  [m-n~='f20@768-992x300-600^2'] {
    font-size: 20px;
  }
}
```

Параметры шаблона сокращенной записи медиа-запроса в нотации не являются обязательными и некоторые из них можно опустить, например:  
INPUT:  
```html
<div m-n="f20@768 f30@992- f40@x600 f50@1000-1200 f3@x10-60">текст</div>
```  

OUTPUT:  
```css
@media (min-width: 1000px) and (max-width: 1200px) {
  [m-n~='f50@1000-1200'] {
    font-size: 50px;
  }
}
@media (max-width: 768px) {
  [m-n~='f20@768'] {
    font-size: 20px;
  }
}
@media (min-height: 10px) and (max-height: 60px) {
  [m-n~='f3@x10-60'] {
    font-size: 3px;
  }
}
@media (min-width: 992px) {
  [m-n~='f30@992-'] {
    font-size: 30px;
  }
}
@media (max-height: 600px) {
  [m-n~='f40@x600'] {
    font-size: 40px;
  }
}
```


### Essences of styles

В MN эссенция стиля - это именованная атомарная абстракция с набором опций, на основе которых генерируются стили.
Эти опции включают:
* атрибуты стилей;
* приоритет в ранжировании;
* массив cелекторов, которые будут конкатенироваться к целевым селекторам;
* массив имен примешиваемых эссенций;
* массив имен эссенций, от которых наследуется текущая эссенция;
* ассоциативный массив дочерних эссенций;
* ассоциативный массив эссенций для конкретных медиа-запросов.


Эссенции могут быть двух типов:
* статические;
* динамические.

Статические эссенции задаются путем установки опций эссенции напрямую.

Динамические эссенции задаются путем установки функции генерирующей опции эссенции.

Как создаются эссенции стилей:

```js
// Статическая эссенция
mn('btnTheme', {
  //priority: 10, - можно задать приоритет эссенции
  //exts: [ 'dn250' /*, ... */ ], - так можно наследовать свойства других эссенций, аналогично @extend в SASS
  //include: [ 'dn250' /*, ... */ ], - так можно примешивать свойства других эссенций, аналогично @include в SASS
  style: { //здесь указываем стили эссенции
    fontSize: '16px',
    display: 'inline-block',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer'
  },
  childs: { //здесь мы можем добавлять определения для дочерних/вложенных элементов эссенции
    inner: { // inner - это просто именованное значение дочернего элемента для навигации по вложенным элементам
      selectors: [ ' .btn-inner' ], // здесь можно задать селекторы дочернего элемента
      //priority: 10, - приоритет можно задать дочерним элементам эссенции
      style: { //здесь указываем стили дочернего элемента эссенции
        width: '200px',
        maxWidth: '100%',
        color: '#FFF',
        padding: '0px 15px',
        position: 'relative',
        height: '45px',
        borderColor,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderBottomWidth: '3px'
      }
      //,childs: { ... } - вложенностей может быть сколько угодно
    }
    //,other: { ... } - другой дочерний элемент
  },
  media: {
    print: {
      style: {
        display: none;
      }
    },
    //sm ...
  }
});
```

Есть возможность устанавливать/менять атрибуты дочерних элементов эссенции, например, таким образом:  
```js
mn('btnTheme.inner', {
  style: {
    width: '250px'
  }
});
```


Пример того, каким образом может быть задекларирована эссенция ``` tbl ``` :
```js
mn('tbl', {
  style: {display: 'table'},
  childs: {
    cell: {
      selectors: [ '>*' ],
      style: {
        display: 'table-cell',
        verticalAlign: 'middle'
      }
    }
  }
});
```  
или так:  
```js
mn('tbl', {
  style: {display: 'table'}
});
mn('tbl.cell',  {
  selectors: [ '>*' ],
  style: {
    display: 'table-cell',
    verticalAlign: 'middle'
  }
});
```  

Работает это следующим образом:  

Example 1.  
Вы просто пишите в разметку:
```html
<div m-n="tbl">
  <div>текст</div>
</div>

```  
CSS для этой разметки генерируется автоматически:
```css
[m-n~='tbl']>*{display:table-cell;vertical-align:middle}
[m-n~='tbl']{display:table}
```

Example 2.
Как это работает с контекстами эссенций:
```html
<div m-n="tbl>.example2__item">
  <div class="example2__item">
    <div>текст</div>
  </div>
  <div class="example2__item">
    <div>текст</div>
  </div>
</div>
```
Сгенерированный CSS:
```css
[m-n~='tbl>.example2__item'] .example2__item>*{display:table-cell;vertical-align:middle}
[m-n~='tbl>.example2__item'] .example2__item{display:table}
```


Example 3.  
Практический пример:
```html
<div m-n="mb10 lh">
  <a class="example__button" m-n="tbl w200 h50 tc cF bg0">
    <div>центрированный текст</div>
  </a>
</div>
```
Сгенерированный CSS:
```css
[m-n~='lh']{line-height:1}
[m-n~='bg0']{background:rgba(0,0,0,1)}
[m-n~='cF']{color:rgba(255,255,255,1)}
[m-n~='tc']{text-align:center}
[m-n~='tbl']>*{display:table-cell;vertical-align:middle}
[m-n~='tbl']{display:table}
[m-n~='h50']{height:50px}
[m-n~='w200']{width:200px}
[m-n~='mb10']{margin-bottom:10px}
```



### Dynamic essences
(Обработчики, генерирующие стили)

На вход функций, которые Вы задаете для генерации эссенций стилей, подставляются параметры извлеченные при предварительном парсинге строки эссенции в результате сопоставления строки с последовательностью шаблонов:  

1. ``` ^([a-z]+):name(.*?):suffix$ ```  
2. ``` ^(.*?):suffix(-i):ni$ ```  
3. ``` ^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$ ```  

```js
params.ni || (params.ni = '');
params.i = params.ni ? '' : '!important';
```



PS: см. функцию **mn-utils/routeParseProvider**


#### Generating the essences of styles
Example 1:

INPUT:  
```html
<div m-n="p20 mb20 dt5 br2">...</div>
```
```js
mn('p', p => {
  return {
    style: {
      padding: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('mb', p => {
  return {
    style: {
      marginBottom: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('dt', p => {
  return {
    style: {
      top: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('br', p => {
  return {
    style: {
      borderRightWidth: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
```

OUTPUT:  
```css
[m-n~='p10']{padding:10px}
[m-n~='mb20']{margin-bottom:20px}
[m-n~='dt5']{top:5px}
[m-n~='br2']{border-right-width:2px}
```



Example 2:

Обработчик:  
```js
mn('x', p => {
  return {
    style: {
      transform: 'translate(' + ((p.x || '0') + (p.xu || 'px')) + ',' +
        ((p.y || '0') + (p.yu || 'px')) + ')' +
        (p.s ? (' scale(' + (0.01 * p.s) + ')') : '') + p.i
    }
  };
}, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([sS]([0-9]+):s)?$');
```


```html
<div m-n="x10y5">...</div>
```
```css
[m-n~='x10y5']{
  -khtml-transform:translate(10px,5px);
  -ms-transform:translate(10px,5px);
  -o-transform:translate(10px,5px);
  -moz-transform:translate(10px,5px);
  -webkit-transform:translate(10px,5px);
  transform:translate(10px,5px)
}
```


```html
<div m-n="x12">...</div>
```
```css
[m-n~='x12']{
  -khtml-transform:translate(12px,0px);
  -ms-transform:translate(12px,0px);
  -o-transform:translate(12px,0px);
  -moz-transform:translate(12px,0px);
  -webkit-transform:translate(12px,0px);
  transform:translate(12px,0px)
}
```


```html
<div m-n="x0y20%">...</div>
```
```css
[m-n~='x0y20%']{
  -khtml-transform:translate(0px,20%);
  -ms-transform:translate(0px,20%);
  -o-transform:translate(0px,20%);
  -moz-transform:translate(0px,20%);
  -webkit-transform:translate(0px,20%);
  transform:translate(0px,20%)
}
```


```html
<div m-n="x0y20">...</div>
```
```css
[m-n~='x0y20']{
  -khtml-transform:translate(0px,20px);
  -ms-transform:translate(0px,20px);
  -o-transform:translate(0px,20px);
  -moz-transform:translate(0px,20px);
  -webkit-transform:translate(0px,20px);
  transform:translate(0px,20px)
}
```


```html
<div m-n="x7%y20%">...</div>
```
```css
[m-n~='x7%y20%']{
  -khtml-transform:translate(7%,20%);
  -ms-transform:translate(7%,20%);
  -o-transform:translate(7%,20%);
  -moz-transform:translate(7%,20%);
  -webkit-transform:translate(7%,20%);
  transform:translate(7%,20%)
}
```


```html
<div m-n="x0y20s90">...</div>
```
```css
[m-n~='x0y20s90']{
  -webkit-transform:translate(0px,20px) scale(0.9);
  -moz-transform:translate(0px,20px) scale(0.9);
  -o-transform:translate(0px,20px) scale(0.9);
  -ms-transform:translate(0px,20px) scale(0.9);
  -khtml-transform:translate(0px,20px) scale(0.9);
  transform:translate(0px,20px) scale(0.9)
}
```

### Auto prefixes

Вы можете настроить авто-подстановку префиксов для кроссбраузерности верстки, добавив имена свойств стилей в карту префиксов таким образом:
```js
mn.propertiesStringify.prefixedAttrs.transform = true;
mn.propertiesStringify.prefixedAttrs.transitionDuration = true;
mn.propertiesStringify.prefixedAttrs.pointerEvents = true;
mn.propertiesStringify.prefixedAttrs.userSelect = true;
mn.propertiesStringify.prefixedAttrs.filter = true;
mn.propertiesStringify.prefixedAttrs.boxSizing = true;
```

либо так:
```js
mn.utils.extend(mn.propertiesStringify.prefixedAttrs, {
  transform: true,
  transitionDuration: true,
  pointerEvents: true,
  userSelect: true,
  filter: true,
  boxSizing: true
});
```

, но лучше так:
```js
mn.utils.flags([
  'transform', 'transitionDuration', 'pointerEvents', 'userSelect', 'filter', 'boxSizing'
], mn.propertiesStringify.prefixedAttrs);
```


Указать какие именно префиксы должны подставляться Вы можете так:
```js
mn.utils.flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
```

### States

Состояние - в MN это часть записи нотации после двоеточия(``` : ```), которой может соответствовать аналогичные псевдоселекторы в терминах CSS.  
В MN мы стараемся использовать сокращенные записи. Так для одного имени состояния в MN можно указать несколько произвольных селекторов.


Input:
```html
<i
  class="ion-chevron-right"
  m-n="x10:h cF00:a f16:(h|a)"
></i>
```

```js
mn.utils.extend(mn.states, {
  h: [ ':hover' ],
  a: [ ':active', '.active' ]
});
```

Output:
```css
[m-n~='x10:h']:hover{
  -khtml-transform:translate(10px,0px);
  -ms-transform:translate(10px,0px);
  -o-transform:translate(10px,0px);
  -moz-transform:translate(10px,0px);
  -webkit-transform:translate(10px,0px);
  transform:translate(10px,0px)
}
[m-n~='cF00:a']:active,
[m-n~='cF00:a'].active{
  color:rgba(255,0,0,1)
}
[m-n~='f16:(h|a)']:hover,
[m-n~='f16:(h|a)']:active,
[m-n~='f16:(h|a)'].active{
  font-size: 16px;
}
```

Если Вы укажете какое-либо иное незадекларированное состояние, то оно выводится как есть:
```css
f16:hz ->
[m-n~='f16:hz']:hz{font-size: 16px;}

f16:hover ->
[m-n~='f16:hover']:hover{font-size: 16px;}
```


*Вы можете параметризовать состояния через квадратные скобки:*

```js
mn.states.n = [ ':nth-child' ];
```

```css
f16:n[3n+2] ->
[m-n~='f16:n[3n+2]']:nth-child(3n+2){font-size: 16px;}
```

PS: В связи с тем, что круглые скобки являются служебными символами MN, необходимыми для группировки подстрок, то вместо них применяются квадратные скобки.  


Вы можете без проблем в нотации записать псевдокласс отрицания:
```css
f16:not[.active] ->
[m-n~='f16:not[.active]']:not(.active){font-size: 16px;}

f16:not[[type=number]] ->
[m-n~='f16:not[[type=number]]']:not([type=number]){font-size: 16px;}
```

Вы можете указать в нотации несколько состояний:
```css
f16:(hover|active) ->
[m-n~='f16:(hover|active)']:hover, [m-n~='f16:(hover|active)']:active{font-size: 16px;}
```


В состояниях предусмотрена возможность использования нестандартных псевдоклассов в качестве синонимов:  

Input:
```js
mn.states.i = [
  '::-webkit-input-placeholder',
  '::-moz-placeholder',
  ':-ms-input-placeholder',
  '::placeholder'
];
```


```html
<input m-n="cA:i" placeholder="имя"/>
```  

Output:
```css
[m-n~='cA:i']::-webkit-input-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']::-moz-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']:-ms-input-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']::placeholder{color:rgb(170,170,170)}
```


PS: селекторы с нестандартными псевдоклассами и браузерными префиксами для валидности автоматически разбивается на отдельные каскадные блоки.


### Parent/child selectors

Разделитель родительских селекторов: ``` < ```

Например, для записи ``` bgF00<.active ``` генерируется следующий селектор:  

```css
.active [m-n~='bgF00<.active'] { /* ... */ }
```

Так мы можем указать для текущего элемента при наличии какого родительского элемента будет отображаться стиль эссенции ``` bgF00 ```.


Разделитель дочерних селекторов: ``` > ```  
С дочерними селекторами всё точно также как и с родительскими, только наоборот.  


Например, для записи ``` bgF00>.active ``` генерируется следующий селектор:  
```css
[m-n~='bgF00>.active'] .active { /* ... */ }
```


### Depth


Для задания определенной глубины вложенности мы можем подставить число перед селектором, например:  

```css
/* bgF00<1.active -> */
.active>[m-n~='bgF00<1.active'] { /* ... */ }

/* bgF00<2.active -> */
.active>*>[m-n~='bgF00<2.active'] { /* ... */ }

/* bgF00<3.active -> */
.active>*>*>[m-n~='bgF00<3.active'] { /* ... */ }
```


Если нужно чтобы стили эссенции были активны при наличии какого-либо селектора(в частности класс ``` active ```) на текущем элементе:
```css
/* bgF00<0.active -> */
.active[m-n~='bgF00<0.active'] { /* ... */ }
```

Если есть отрицательный знак, то мы получим распространение стиля эссенции на дочернии элементы:
```css
/* bgF00<-1.active -> */
[m-n~='bgF00<-1.active']>.active { /* ... */ }

/* bgF00<-2.active -> */
[m-n~='bgF00<-2.active']>*>.active { /* ... */ }
```


Вы можете игнорировать разделитель.  
Если нужно чтобы стили эссенции были активны при наличии какого-либо селектора на текущем элементе (в частности класс active), то Вы можете писать более лаконично и получать на выходе желаемое:  

```css
/* bgF00.active -> */
[m-n~='bgF00.active'].active { /* ... */ }
```


### Complex selectors


Всё вышеперечисленное аналогично можем применять и для других селекторов с атрибутами:  
```css
/* bgF00>[type=text] -> */
[m-n~='bgF00>[type=text]'] [type=text] { /* ... */ }

/* bgF00[type=text] -> */
[m-n~='bgF00[type=text]'][type=text] { /* ... */ }
```

Пример более сложного селектора:
```css
/* bgF00.theme1.active -> */
[m-n~='bgF00.theme1.active'].theme1.active { /* ... */ }
```

Разделители подразумевают, что Вы можете совместно указать сколько угодно родительских и дочерних элементов и состояний в контексте эссенции:  
```css
/* bgF00.active<.md>.anyChild -> */
.md [m-n~='bgF00.active<.md>.anyChild'].active .anyChild { /* ... */ }
```


Example 1:  

Input:
```html
<a href="#">
  <i
    class="ion-chevron-right"
    m-n="x10<a:h cF00:a"
  ></i>
</a>
<div m-n="c0F0:a<.parent1">...</div>
<div m-n="bg02<.parent1<.parent2">...</div>
<div m-n="c065:a<0.parent1">...</div>
<div m-n="bgD852<3.parent1<.parent2:h">...</div>
```

Output:
```css
[m-n~='cF00:a'].active,
[m-n~='cF00:a']:active{
  color:rgba(255,0,0,1)
}
a:hover [m-n~='x10<a:h']{
  -khtml-transform:translate(10px,0px);
  -ms-transform:translate(10px,0px);
  -o-transform:translate(10px,0px);
  -moz-transform:translate(10px,0px);
  -webkit-transform:translate(10px,0px);
  transform:translate(10px,0px)
}
.parent1 [m-n~='c0F0:a<.parent1']:active,
.parent1 [m-n~='c0F0:a<.parent1'].active{
  color:rgba(0,255,0,1)
}
.parent1[m-n~='c065:a<0.parent1']:active,
.parent1[m-n~='c065:a<0.parent1'].active{
  color:rgba(0,102,85,1)
}
.parent2 .parent1 [m-n~='bg02<.parent1<.parent2']{
  background-color:rgba(0,0,0,0.13333333333333333)
}
.parent2:hover .parent1>*>*>[m-n~='bgD852<3.parent1<.parent2:h']{
  background-color:rgba(221,136,85,0.13333333333333333)
}
```


Example 2:  

Input:
```html
<div m-n="(sq50|bg0)<2.anyClass"></div>
<div m-n="(w50|h5|bg00F8)>5.innerItem"></div>
```
Output:
```css
.anyClass>*>[m-n~='(sq50|bg0)<2.anyClass']{
  background:rgba(0,0,0,1)
}
.anyClass>*>[m-n~='(sq50|bg0)<2.anyClass']{
  width:50px;
  height:50px
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  background:rgba(0,0,255,0.5333333333333333)
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  height:5px
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  width:50px
}
```


### Essences assignment
(Example with container)


Связывание селекторов с эссенциями стилей


Для наглядности рассмотрим приближенный синтетический пример имплементации контейнера из Twitter Bootstrap 3.

Так это делается вручную с помощью CSS:

```css
.container {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px
}
@media (min-width: 768px) {
  .container {
    width: 750px
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1170px
  }
}

```

Для того, чтобы сделать тоже самое с MN можно пойти разными путями в зависимости от Ваших нужд.  

Несколько лаконичных способов:  

Example 1.
```js
mn.assign('.container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```

Example 2. Без использования предустановленных синонимов по умолчанию для медиа-запросов:  
```js
mn.assign('.container', '(mhAuto|ph15|w750@768-|w970@992-|w1170@1200-)');
```

Example 3. Если мы хотим иметь возможность переиспользовать стили контейнера в других селекторах,
то мы можем декларировать контейнер как эссенцию:
```js
mn('container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```

Таким образом будет задействована вся мощь минималистической нотации, для которой селекторы генерируются автоматически:  
Input:
```html
<div class="container">...</div>
<div class="container>.child">
  <div class="child"></div>
  <div class="child"></div>
</div>
<div class="parent">
  <div class="container<.parent">...</div>
</div>
```

Output:
```css
.container, .container\>\.child .child, .parent .container\<\.parent {
  margin-right: auto;
  margin-left: auto;
}
.container, .container\>\.child .child, .parent .container\<\.parent {
  padding-left: 15px;
  padding-right: 15px
}
@media (min-width: 768px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 750px
  }
}
@media (min-width: 992px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 970px
  }
}
@media (min-width: 1200px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 1170px
  }
}
```

Этот приведенный пример
```js
mn('container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```
является сокращенным способом такой декларации:
```js
mn('container', {
 exts: '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)'
});
```

В приведенных выше примерах декларация эссенции осуществляется на основе других более атомарных эссенций.

Таким образом мы можем многократно переиспользовать однажды созданные эссенции стилей в новых эссенциях.

Вместо этого мы также могли декларировать эссенцию тем же способом, что и более атомарные эссенции, на которых мы основывались до этого.

Допустим, у нас пока нет тех атомарных эссенций, которые мы использовали в прошлых примерах, и нам было лень их писать до этого момента,
либо мы руководствуемся какими то другими причинами. Тогда мы можем декларировать эссенцию контейнера таким способом:
```js
mn('container', {
  style: {
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  media: {
    /*
    '(min-width: 768px)': {
      style: {
        width: '750px'
      }
    },
    */
    // with synonyms:
    'm2-': {
      style: {
        width: '750px'
      }
    },
    d: {
      style: {
        width: '970px'
      }
    },
    d2: {
      style: {
        width: '1170px'
      }
    }
  }
});
```


### Priority multiplier

В MN есть возможность манипуляции приоритетом стилей, которая позволяет лаконично перекрывать влияние некоторых других CSS правил.

Format:
```
{notation}*{multiplier:([0-9]+)}
```

Example 1:  

```html
<div m-n="h40*3"></div>
```
Output:  
```css
[m='h40*3'][m='h40*3'][m='h40*3'] {
  height: 40px;
}
```


Example 2:  

```html
<div m-n="h40.isActive*2"></div>
```
Output:  
```css
[m='h40.isActive*2'][m='h40.isActive*2'].isActive {
  height: 40px;
}
```



Example 3:  

```html
<div m-n="h40>.child1>.child2*3"></div>
```
Output:  
```css
[m='h40>.child1>.child2*3'][m='h40>.child1>.child2*3'][m='h40>.child1>.child2*3'] .child1 .child2 {
  height: 40px;
}
```
