[Русский](https://github.com/mr-amirka/amirka/blob/master/src/from-author-ru.md)


# From the author



* [How it started](#how-it-started)  
* [Minimalism](#minimalism)   



* [Getting started](https://github.com/mr-amirka/amirka/blob/master/README.md)
* [More documentation](https://github.com/mr-amirka/amirka/blob/master/src/README.md)
* [Presets](https://github.com/mr-amirka/amirka/blob/master/src/presets.md)



Try this tests:
* https://jsfiddle.net/j6d8aozy/51/  
* https://jsfiddle.net/j6d8aozy/46/  

Home page: http://minimalist-notation.org



I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).
With love, your mr.Amirka :)


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).



## How it started


In some CSS frameworks, in the same Twitter Bootstrap, in some cases we literally indicate in the markup:
```html
class="text-center"
```
, instead of
```html
style="text-align: center;"
```
In practice, this is similar to the old “criminal” inline way of setting styles for elements. The only difference is in the slightly abbreviated form of writing and the priority of styles.



I see no benefit in clogging the project with files with extra CSS code, given the likelihood that it may potentialy uncontrollably lose relevance as the markup for which it was written may be changed. The project may accumulate CSS code, the relevance of which is not known to us. When trying to clean it up, you can accidentally delete something that is necessary, and as a result, the consequences of this action can be very sad. Although, of course, the component approach, or some methodologies, such as BEM, or properly configured build systems helps to cope with this problem, however here you see another solution.



The main disadvantage of inline styles is that they are very bulky and make markup less readable. CSS allows us to place the necessary styles in a class, and then specify this class for the elements we need. But at the development time of the project, the CSS grows, and the garbage dump from the heap of unused styles accumulates in it, or if this was developed "developers with curved hands", which I often watched, then there is lot of rakes from the heap of overlaying each other rules of CSS.


Some developers is flaunt the fact that they used Twitter Bootstrap 3 in their projects, but in practice I had to deal with the fact that most of the developers I knew made wild overlaying on top of the standard styles in the classes of this library. In all cases, using Twitter Bootstrap 3, as such, did not make much sense.


In my observations, most often from the entire garbage, which is in this ballast library, for the most part, only the adaptive grid is used, since the tasks are often quite specific - I myself did this for the first six months of my acquaintance with Bootstrap 3.
After becoming acquainted with the SASS preprocessor, I began to independently generate an adaptive grid to fit my needs.  


Adaptation of Bootstrap 3, in fact, extends only to the column grid for different screen resolutions and some pre-installed and often unclaimed elements.


In the adaptive grid, we use suffixes in the class notation corresponding to a specific width of the browser window, or rather media queries, such as: -xs, -sm, -md, -lg. For example: col-sm-6, col-md-4, col-lg-6.


In my opinion, the omission of Bootstrap 3 is that prefixes are not provided for the adaptability of other actual styles: text-left, text-center, etc. For example: text-center-xs, text-left-md.


For obvious reasons, such a notation is not provided for the adaptability of font sizes, for example: font-size-sm-14, font-size-lg-20. Although, for my tasks, this feature is in demand, I understand that the generation of classes for all font sizes will give a lot of useless CSS code.


By the way, note that the more CSS-code, the stronger it slows down the browser. This is due to the fact that under the hood of the browser, cascades of styles, roughly speaking, are a ranked list of templates, with each of which is matched each markup element during each rendering. The more saturated the DOM and the longer the list of cascading rules, the more clearly the inhibition. Braking is especially obvious when animation is applied, because rendering animations can increase the frequency of these comparisons.


My approach to the layout is a well-proven general optimal approach of most CSS frameworks, to which we arrive by experience. He partially is borrowed by me from famed the Twitter Bootstrap. The essence of the approach is to define in each CSS class a minimal set of styles to take into account many common situations, which allows us to:
* not add new classes for similar cases;
* avoid excessive overlapping styles;
* yourself am not confused in the cumbersome CSS code, vainly reserving in your brain the “memory cells” for all these continuously multiplying selectors and cascades of  styles.

The idea of creating MN technology came at a time when, in the course of my professional activity, I got into the habit of writing CSS like this:
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
In my code, there was already a certain notation comparable to strictly defined style attributes, their values ​​and media queries.

At first I was try to automate the generation of classes by LESS preprocessors, then SASS.

Then I thought about developing my technology, which could involves the generation of styles based on the notation of class names in the markup itself, which would allow even more automation of the development process.

In order to research out all the nuances, I studied the BEM methodology, which I met earlier in 2017, in more detail. BEM offers a unique naming of components and their components in order to avoid collisions of names from different components, a hierarchy of placement of source codes of components, which is essentially similar to that in the component approach methodology.
This idea is understandable, but my approach also allows me to reduce the writing of unnecessary code, systematize the naming of classes and improve the understanding of their purpose in the markup.



Agree, in any case, you have to write class names in the markup, and if MN is compared with something then, for example:
1. The total value of the attribute ``` class ``` or ``` m ``` in your markup may even be less than the class names in BEM.
2. No need to write CSS.
3. The names of classes almost literally speak for themselves what exactly they do.
4. The eternal problem of the programmer: "How to named a variable?". In most cases, you save time and mental energy, eliminating the need to once again think about how best to name a class for any element, as you are guided by a predefined template.
5. In perspective, essences and rules of generation of essences form an easily expandable, flexible and finite fundamental base, which can act as a generally accepted standard for most developers, reducing the threshold of entry.
6. Due to the flexibility and reactive nature of the technology, based on b



The BEM methodology in its aspects of cumbersomeness and non-adaptability is somewhat opposite to the methodology that I adhere to, but it is quite possible to apply it together. For example, in order to give your markup a little semantics, which will help you looking at the markup to understand that such and such a fragment of the markup is related specifically to such a component. Often, this is not difficult to understand, but nonetheless.
Combining the use of BEM is also advisable when you write CSS for creating themes, customizing color schemes, font sizes and other attributes that do not require changing the code of the markup itself.


In my notation, instead of the notion "Element", there is the notion "Essence of Style", around which everything revolves. An alternative to the concepts of "Block" and "State Modifier" is the "Context of Essence", which, in fact, is an improved alternative to CSS selectors. Through these selectors, you can concisely indicate all those situations in which styles of essences become active.



When I started to develope MN, my goal was:

1. Automate the generation of CSS, for my manual way of writing CSS has become mechanical. If I already add new classes for each individual value of the style attribute, calling them the appropriate abbreviations - where there is a direct relationship, then why don't I make their automatic generation directly from the markup in order not to open anymore the CSS file? This is geniusly! It looks like a kind of reactivity paradigm implementation in CSS!
As you know, markup makes sense without CSS, but by itself CSS does not make sense without markup. In our case, the everything needed in the one place. The markup is autonomous and all information about its appearance is in it.
This approach has something in common with the Angular directive approach. The difference between pure CSS and MN is about the same as between VanillaJS and Angular, or between jQuery and Angular. In the first case, you manipulate DOM elements manually, manually registrate elements selectors in JS, for which you need to initialize a plugin or hang up an event. In the second case, you simply write on the desired element in the markup a directive that initializes the component or sets the expression to be executed upon the occurrence of an event.

2. To avoid collisions with class names. It is possible to generate styles for a separate custom attribute in markup. In notation, the use of service characters are exploited in a cheeky way, which, it is unlikely, someone will use voluntarily, since their manual shielding in CSS is quite expensive and stressful to read. The service symbols are supported by a rigid notation framework in MN, which allows you to restrict yourself minimally in the parameterization of notation essences. There is also a convenient opportunity, if necessary, to escape characters that are serviced if they should be in the parameters of the essence.

3. Develop the most adaptive and concise notation system that takes into account the mutability of styles depending on changes in state, attributes and classes both on the element itself and on its parent elements, and depending on changes in media queries.
With MN technology, you may feel that the cascades of styles have moved directly into the markup itself. MN looks like a more concise analogue and alternative to inline styles with mutability depending on the media query, state, attributes and classes both on the element itself and on its parent elements.


All subsequent features were added already in the process of applying MN in my projects. I added something that made it possible to reduce routine actions with writing class names in the markup itself:

1. The ability to specify in the notation of the name of the class of the current element how style its child elements - this is a very handy feature that has help me many times.

2. Reduction of the record of several class names with similar substrings, thanks developed by me the notation of grouping of substrings;

Some features were added purely experimentally due to the fact that there is something similar in other preprocessors, and something seemed possible and easily achievable:


1. Inheritance from the essences of styles (extension). This is a cool feature. Sometimes it is needed, but rarely needed due to other features of MN. I do not recommend its use without necessity, due to the fact that:
* First, multiple inheritance makes the code harder to understand;
* secondly, when the essence ``` A ``` inherits the properties of the essence ``` B ```, selectors associated with the essence ``` A ``` are also associated with the essence ``` B ```. This in most cases leads to the fact that the generated final CSS-code due to duplication of selectors by volume can significantly exceed the CSS-code obtained using impurities.

2. Impurities of essences. Essencess impurities can be used as an alternative to the inheritance of essences, depending on how optimal it is for the current project by your point of view. Impurities differ from inheritance in that they directly copy the attributes of donor essences during the precompilation step of the essence, which is more optimal.

3. The association of selectors with style essences is a rarely used but very convenient option.

4. Availabale manipulation of global CSS styles in runtime. From this list, the manipulation of global CSS styles in runtime is most often used mainly as a way of alternatively specifying styles when we want not to see the CSS files in our project at all.





Later I found out that the methodology I follow is like the Functional / Atomic CSS methodology.
So far, I ha not studied the existing technologies at the moment, which are also focused on this methodology, but I naively believe that my solution covers all their possibilities!))  




## Minimalism!
In my case, minimalism implies the minimum complexity of problem solving, in particular, the following:
* the minimum number of characters code;
* minimal memory allocation in your brain for memorizing classes and which styles correspond to them;
* elimination of unnecessary abstractions.  


The main idea: the generation of styles is based on the class names found in the markup - nothing superfluous! Thus, we will not have unused CSS-code, and in most cases we can is not write CSS-code at all, and even not got CSS-files from the server because CSS is unpacked, like a rar-archive from the markup itself.  



You remember only the basic notation rule and interpretation rules for parameterized names that you set yourself, as well as options at your discretion: states, contexts of parent / child selectors and synonyms.  


In base the principle of forming a class name from an attribute of a style - this, in essence, is the same abbreviated analogue of inline styles, but I tried to shorten the names of the classes to abbreviations so that they are as short as possible, but nonetheless to avoid collisions.
Part of the class name is responsible for the attribute of style, part - for its value - this is not enough for adaptability, so I did more, and you can see this from the examples above.  

You can add your handler that generates essences of styles. Examples are located in the repository directory ``` /mn-presets ```.



I tried to make parsing and the CSS generating as optimal as possible:
* if the registered class name is already registered once, then the repeated call of the check method for this name will be ignored.
* If a new class name has been registered, the rendering procedure does not occur immediately, but is postponed to the end of the iteration of the event loop and runs once after all the previous calls to the check method.
* values in inside are grouped by media-queries contexts and essences  styles, each of which contains separately precompiled text of CSS attributes and text of CSS selectors that remain unchanged if registration of a new name does not apply to this essence. Those. When registering new class names, there is a minimum of string concatenation operations.
* CSS handler generators are triggered once for each unique essence.
