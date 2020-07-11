[Русский](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author-ru.md)


# From the author


* [How it started](#how-it-started)  
* [Minimalism](#minimalism)   



## How it started


Using many CSS frameworks, for example, such as Twitter Bootstrap, We write html code this way:  
```html
<div class="text-center">...</div>
```
, instead of doing the same through inline style:  
```html
<div style="text-align: center;">...</div>
```
In practice, this approach is similar to the old “criminal” for some inline way of setting styles for elements. The difference is only in a slightly reduced form of writing and priority of styles.  

In fact, in such examples, using classes instead of inline styles makes little sense.  

The main disadvantage of inline styles is that they are very bulky and make the html code less readable.  
CSS allows us to assign the necessary styles to a class, and then specify this class in the target elements, and this allows us to reduce the html code and automate the setting of styles a little, which accordingly speeds up Our work.  
Also in CSS We can set behavior when changing various selectors and media queries.  

There are several problems with CSS:  

  * context break that slows down the editing process;
  * the presence of excess abstraction as a separate file with styles;
  * the need to monitor and clean dependencies;
  * the behavior of classes in the code are not obvious and need to navigate the code each time to understand their purpose;
  * excessive cognitive load due to the need to come up with new class names;
  * side effects and rakes from overlapping CSS rules - although various component approaches are now addressing this flaw;
  * Lots of CSS. The more CSS there is, the more the browser slows down.  
  This is due to the fact that under the hood of the browser, cascades of styles, roughly speaking, are a ranked list of templates, with each of which each html element is matched during each rendering.  
  The more saturated the DOM tree and the longer the list of cascading rules, the more obvious freez. Braking is especially pronounced when animation is applied, as rendering animations can increase the frequency of comparisons..

There are cases when developers are not able to use modern technologies or component approaches.  
Over time, CSS in their projects grows. It accumulates trash from unused styles and the lot of rakes from overlapping CSS rules.


Like many other developers, I started my epic of make adaptive UIs with Twitter Bootstrap.  
Some flaunted the fact that they use this "framework" in their projects, but in practice, I often saw that most developers made wild overlays on top of the standard styles of this library.  
In all cases, using Twitter Bootstrap 3 as such did not make much sense.  
In my observations, from the entire dustbin of the rules that exist in this actually ballast library, for the most part only an adaptive grid is used.  
I myself also used Bootstrap for the first six months of getting to know him.  
After getting to know the SASS preprocessor, I myself began to generate an adaptive grid for my own needs.  

The adaptation Bootstrap 3, in fact, applies only to the column grid for different screen resolutions and some predefined and often unclaimed elements.  

In the adaptive grid, we use suffixes in class notation that correspond to a certain width of the browser window, or rather media queries, such as -xs, -sm, -md, -lg.  
For example: col-sm-6, col-md-4, col-lg-6.


Often I wanted to have the ability to adapt other relevant styles of Bootstrap classes: text-left, text-center, etc. by analogy, for example: text-center-xs, text-left-md.  

It is very strange that this was not in the library.  


For obvious reasons, such a notation is not intended for adaptability of font sizes, for example: font-size-sm-14, font-size-lg-20.  
Although, for my tasks, a similar feature is in demand,
I understand that generating classes for all font sizes will yield a lot of useless CSS code.


My CSS approach is a well-established general optimal approach for most CSS frameworks, which We all are coming to experimentally.

I borrowed it partly from famous Twitter Bootstrap.  
The essence of the approach is to define in each CSS class a minimal set of styles to take into account many common situations, which allows us to:  

  * do not add new classes for similar cases;
  * avoid excessive overlapping styles;
  * do not get confused in cumbersome CSS code, vainly reserving “memory cells” in your brain for all these continuously multiplying selectors and cascades of styles.  


The idea of creating MN technology arose at a time when in the process of professional activity I got into the habit of writing CSS in approximately this way:  
```css
.p10{
  padding: 10px;
}
.pl10{
  padding-left: 10px;
}
.mh5{
  margin-left: 5px;
  margin-right: 5px;
}
@media (max-width: 768px){
  .p10-xs{
    padding: 10px;
  }
  .pr10-xs{
    padding-right: 10px;
  }
}
```
There was already a certain notation in my code comparable to strictly defined attributes of styles, their values and media queries.  

At first, I tried to automate the generation of classes by the SASS preprocessor, roughly speaking, in approximately this way:  
```scss
$grids: (
  // suffix, media, container width
  ('', all ),
  ('-sm', (max-width: 992px), 750px),
  ('-xs', (max-width: 768px), 480px),
  ('-xm', (max-width: 480px) ),
  ('-xn', (max-width: 360px) ),
  ('-mm', (max-width: 320px) ),
  ('-md', (min-width: 992px), 970px ),
  ('-lg', (min-width: 1200px), 1170px ),
  ('-ll', (min-width: 1600px), 1570px )

  //,('-print', print )
);

$prefixes: ( '-o-', '-ms-', '-moz-', '-webkit-' );

@mixin cross($name, $value: ''){
  @each $prefix in $prefixes {
    #{$prefix + $name}: $value;
  }
  #{$name}: $value;
}

@mixin sides($name, $valueName, $suffix, $prop, $value) {
  #{$name}#{$valueName}#{$suffix} {
    #{$prop} : $value;
  }
  #{$name}v#{$valueName}#{$suffix} {
    #{$prop}-top : $value;
    #{$prop}-bottom : $value;
  }
  #{$name}h#{$valueName}#{$suffix} {
    #{$prop}-left : $value;
    #{$prop}-right : $value;
  }
  #{$name}t#{$valueName}#{$suffix} {
    #{$prop}-top : $value;
  }
  #{$name}b#{$valueName}#{$suffix} {
    #{$prop}-bottom : $value;
  }
  #{$name}l#{$valueName}#{$suffix} {
    #{$prop}-left : $value;
  }
  #{$name}r#{$valueName}#{$suffix} {
    #{$prop}-right : $value;
  }`
}
@mixin clearfix(){
  &:before, &:after {
    content: " ";
    clear: both;
    display: table;
  }
  @content
}

@mixin keyframes($name) {
  @-o-keyframes #{$name} { @content; }
  @-moz-keyframes #{$name} { @content; }
  @-webkit-keyframes #{$name} { @content; }
  @keyframes #{$name} { @content; }
}

@include keyframes(spinner-animate){
  from { @include cross(transform, rotateZ(0deg)); }
  to { @include cross(transform, rotateZ(360deg)); }
}

.spnr {
  @include cross(animation, spinner-animate 3s infinite linear);
}

%col{min-height: 1px;}

@each $suffix, $media, $container in $grids {
  $i: 12;
  @while $i > 0 {
    .col#{$i}#{$suffix}{ @extend %col; }
    $i: $i - 1;
  }
  @media #{$media} {
    $i: 12;
    @while $i > 0 {
      .col#{$i}#{$suffix}{
        @extend .lt#{$suffix};
        width: 100% * $i / 12;
      }
      $i: $i - 1;
    }

    .cfx#{$suffix} {
      @include clearfix();
    }

    @each $size in 5, 10, 15, 20, 25, 30 {
      #{'.mh-' + $size + $suffix} {
        margin-left: -$size + px;
        margin-right: -$size + px;
      }
    }

    // text-align
    .tl#{$suffix}{text-align:left;}
    .tc#{$suffix}{text-align:center;}
    .tr#{$suffix}{text-align:right;}

    // float
    .lt#{$suffix}{float:left;}
    .ct#{$suffix}{float:none;}
    .rt#{$suffix}{float:right;}

    // display
    .dNone#{$suffix}{display:none;}
    .dBlock#{$suffix}{display:block;}
    .dInlineBlock#{$suffix}{display:inline-block;}
    .dInline#{$suffix}{display:inline;}
    // ...

    // font-size
    @each $size in 12, 14, 16, 18, 20, 24, 30, 32 {
      #{'.f' + $size + $suffix} { font-size: $size + px; }
    }

    // padding
    @each $size in 0, 5, 10, 15, 20, 25, 30 {
      @include sides('.p', $size, $suffix, padding, $size + px)
    }

    // margin
    @each $size in 0, 5, 10, 15, 20, 30 {
      @include sides('.m', $size, $suffix, margin, $size + px);
    }
    // ...
  }
  //...
}
```

Then I began thought about developing my technology, which mean generating styles based on class notation in the html code itself, which would be allow to further automate the development process and improve the quality of the code.  


The main idea: styles are generated automatically based on the attribute values found in the html code itself - nothing more!  


Thus, We will not have unused CSS-code, and in most cases We can not have need write CSS-code at all, and if desired in the runtime version We can even are not go to the server for CSS-files - CSS is unpacked, like a rar-archive , from the html or jsx code itself.  


The basis is the principle of forming a class name from a style attribute - this is, in fact, an analog of inline styles,
only more minimalistic, for I tried to shorten the names of classes to abbreviations.  


Part of the class name is responsible for the style attribute, part for its value.  
However, this is not enough for adaptability, so I have done even more, and We can see this from the examples given in this documentation.  


In order to work out all the nuances, I tried to study in more detail the approaches known to me at the time of 2017 in the development of interfaces, including the "BEM methodology".   


My approach reduces code writing, systematizes class naming, and improves understanding of their purpose in code.  


Agree, in any case, We have to write class names in the html code, and if We compare MN with something, then for example:  

  1. The total value of the ``` class ``` attribute in your markup can be even less than the long BEM class names..
  2. No need to write CSS.
  3. Class names almost literally speak for themselves what exactly they do.
  4. The eternal problem of the programmer: "How to name a variable?". In most cases, we save time and mental energy, eliminating the need to think once again about how best to name the class for any element, since we are guided by a predefined template.
  5. Once defined essences and rules for generating essences in the future form an easily expandable, flexible and final fundamental base, which can act as a generally accepted standard for most developers, which lowers the threshold for entry.
  6. Due to the flexibility and reactive nature of the technology, based on the basic "style essences" and the rules for their generation, a reusable code is created.


The BEM methodology, in terms of its bulkiness and non-adaptability, is somewhat opposite to the methodology that I adhere to, but if necessary it can be applied together.  

In my notation, instead of the concept of "Element" there is the concept of "Essence of style."
An alternative to the concepts "Block" and "State modifier" is the "Essence Context", which includes:  

  * improved alternative to CSS selectors;
  * synonyms or patterns of media queries.

Through a well-thought-out syntax, you can succinctly indicate the behavior of the "essences of styles" when changing all kinds of selectors and media queries.  


When I created MN, my goal was:    

  1. To automate CSS generation, because my manual way of writing CSS has become mechanical. If I already add new classes for each individual value of the style attribute, calling them the corresponding abbreviations - which is a direct correlation, then why don’t I automatically generate them directly from the markup so that I can no need longer open the CSS file? This is geniusly! This is like a peculiar implementation of the reactivity paradigm in CSS!
  As We know, html code makes sense without CSS, but CSS alone doesn't make sense without html. In our case, everything you need is in one place. The markup is autonomous and all information about its appearance is in it itself.  
  This approach has something in common with the Angular directive approach. The difference between pure CSS and MN is about the same as between VanillaJS and Angular, or between jQuery and Angular. In the first case, you manually manipulate DOM elements, manually register element selectors in JS for which you need to initialize any plug-in or hang an event. In the second case, you simply write a directive on the necessary element in the markup that initializes the component or sets the expression to be executed upon the occurrence of an event..  

  2. To avoid collisions with class names. The generation of styles for individual custom attributes in the markup is provided. The notation insolently use service symbols, that it is unlikely that someone will use it voluntarily, since their manual escaping in CSS is quite expensive and “stressful” to read. MN allows We to be minimally limited in the parameterization of notation essences. There is also a convenient opportunity, if necessary, to shield service symbols if they should be in the parameters of the essence.

  3. To develop the most adaptive and concise notation system that takes into account the mutability of styles depending on changes in state, attributes and classes both on the element itself and on its parent elements, and mutability depending on changes in media queries.  
  With MN technology, you might get the feeling that cascades of styles have moved directly to the html code itself. MN looks like a more concise counterpart and an alternative to inline styles with all the features of regular CSS.  


All subsequent features were added during the application of MN in my projects. I added something that allowed me to reduce the routine of writing classes in the html code itself:  

  1. The ability to indicate in a notation of the current element which style its child elements will have is a very convenient feature that has helped me out many times.  

  2. To reducing the writing of several class names with similar substrings thanks the notation of grouping of substrings developed by me and the algorithm for parsing them.  

  3. To prioritize styles in notation.


Some features were added purely experimentally due to the fact that something similar is in other preprocessors, and something seemed possible and easily achievable:  


  1. Inheritance from essences of styles (extension). This is a cool feature. Sometimes it is needed, but I do not recommend its use unnecessarily, due to the fact that:  

  * first, multiple inheritance makes code harder to understand;  
  * secondly, when the essence ``` A ``` inherits the properties of the essence ``` B ```,
    the selectors associated with the essence ``` A ```, are also associated with the essence ``` B ```.
    This in most cases leads to the fact that the generated final CSS code due to the duplication of selectors in volume can significantly exceed the CSS code obtained using mixins.  

  2. The essences mixins. The essences mixins can be used as an alternative to inheritance of essences, depending on how optimal it is for the current project from your point of view. Mixins differ from inheritance in that they directly copy the attributes of donor essences at the step of compiling the essences, which is more optimal.  

  3. The association of selectors with essences of styles is a rarely used but very convenient feature.  

  4. The programmatically manipulation global CSS styles in runtime. Manipulation of global CSS styles in runtime is mainly used as a way of dynamic customization and alternative style setting when we want to not see CSS files in our project at all.  



I later found out that the methodology I follow is referred to as Functional / Atomic CSS.  



## Minimalism!

In my case, minimalism implies the minimum complexity of solving problems, in particular, the following:  

  * minimum code characters;
  * minimal memory allocation in Our brain for storing classes and their corresponding styles;
  * exclusion of unnecessary abstractions.



We remember only the basic notation rules and interpretation rules for parameterized names that we set ourselves, as well as options at Our discretion: synonyms of pseudo-classes, contexts of parent / child selectors.  



We can add our own handler that generates essences of styles.
Examples are in the repository https://github.com/mr-amirka/mn-presets.   


For the runtime version of the library, I tried to make the parsing and CSS generation as optimal as possible:  

  * if the class name is already registered once, then the repeated call of the check method for this name will be ignored.  
  * if a new class name has been registered, the rendering procedure does not occur immediately, but is delayed at the end of the iteration of the event loop and fulfills once after all previous calls to the check method.  
  * in the internal data structures of the preprocessor, selectors are grouped by media query contexts and style essences, for each of which a separate precompiled text of CSS attributes and text of CSS selectors are stored. When registering new class names, there is a minimum of string concatenation operations.  
  * CSS handlers generate once for each unique essence.  
