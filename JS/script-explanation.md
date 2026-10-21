# How `script.js` works

This guide follows [`script.js`](./script.js) from its first line to its last. It explains what the JavaScript statements do and how the pieces work together. The line numbers refer to the current version of the script.

## How to read the code structure

Before following the script, these patterns show how its main kinds of lines are put together. The words in angle brackets are placeholders for the actual names or values used in the script.

### Declaring a value

```js
const variableName = value;
let variableName = startingValue;
```

`const` or `let` comes first, followed by the variable name, an equals sign, and the value to store. The semicolon marks the end of the statement. Use `const` when the variable will not be reassigned; use `let` when it will be reassigned.

For example, `const replyDelay = 1600;` stores the number `1600` in a variable named `replyDelay`.

### Writing an array

```js
const listName = [
  itemOne,
  itemTwo,
];
```

An equals sign connects the variable to the array. Square brackets start and end the array, commas separate its items, and each item can be on its own line. In this script, `subheadings` is an array of strings, and `questions` is an array of objects.

### Writing an object and its properties

```js
const objectName = {
  propertyName: value,
  anotherProperty: value,
};
```

Curly braces enclose the object. Each property is written as a name, a colon, and its value. Commas separate properties. A value can itself be an object or an array, which is how the script nests chapters, questions, and follow-up questions.

### Writing a function

```js
function functionName(parameter) {
  statementsToRun;
}
```

`function` starts the declaration, the name identifies the function, and parentheses contain its inputs (parameters). The braces contain the statements the function runs when called. A function with no inputs still uses parentheses, as in `closeStory()`.

### Writing a condition

```js
if (condition) {
  statementsWhenTrue;
} else {
  statementsWhenFalse;
}
```

The condition goes inside parentheses after `if`. Braces group the statements that should run when the condition is true. `else` is optional and holds the alternative statements. An `else if (anotherCondition)` checks another condition before the final `else`.

### Writing a method call

```js
objectName.methodName(argumentOne, argumentTwo);
```

The value before the dot is the object being used. The method name follows the dot, and parentheses contain the information passed to it (arguments). For example, `dialogueChoices.appendChild(choice);` calls `appendChild` on `dialogueChoices`, passing it `choice`.

### Assigning or updating a property

```js
objectName.propertyName = value;
```

The dot selects a property on an object, and `=` stores the value in that property. For example, `choice.textContent = item.question;` sets the button’s visible text to the question.

### Passing a function to an event or timer

```js
element.addEventListener("event-name", (event) => {
  statementsToRun;
});
```

The method is given an event name and a callback function. `(event) => { ... }` is an arrow function: the code inside its braces runs when that event occurs. A callback can also be written on one line, such as `() => answerStory(item, choice)`. Similarly, `setTimeout(callback, delay)` schedules a callback to run after a delay.

These patterns describe the syntax shape; the numbered sections below explain what each actual line in the file uses that structure to do.

## 1. The rotating words — lines 2–10

```js
const subheadings = [
  "Student",
  "College Graduate",
  "Web Developer",
  "UI/UX Designer",
  "Tech Enthusiast",
  "Problem Solver",
  "Learner",
];
```

- `const` creates a variable that cannot be reassigned to a different array.
- The square brackets `[...]` make an array: an ordered list of values.
- Each quoted value is a string. Later, the script displays these strings one at a time in the page’s rotating heading.
- The commas separate the array items. Their order is the order in which the words will appear.

## 2. The story data — lines 12–120

`storyContent` is a JavaScript object used as a small content database. Its keys (`origin`, `skills`, `hobbies`, and `future`) identify the different chapters. The value for each key is another object containing the text and questions for that chapter.

### The shape of one chapter

The `origin` chapter begins like this:

```js
origin: {
  title: "How I started",
  intro: "...",
  questions: [
    {
      question: "What made you choose this path?",
      answer: "...",
    },
  ],
},
```

- `origin:` is the chapter’s key. Code can retrieve this chapter with `storyContent["origin"]` or `storyContent.origin`.
- `title` is the heading that appears in the modal.
- `intro` is the opening paragraph shown before any question is selected.
- `questions` is an array of question objects. Each object pairs a `question` string with the `answer` to display when that question is clicked.
- Curly braces `{...}` group related properties into an object; square brackets `[...]` group ordered items into an array.

The long strings in the actual file are the portfolio’s written content. They do not execute as commands; the script reads and displays them.

### The four chapters

- `origin` contains questions about choosing IT, aspirations, learning, and motivation.
- `skills` contains questions about what the owner likes building, the tools they use, and their process.
- `hobbies` contains questions about games, music, and the pixel-art style. Some questions have follow-up questions.
- `future` contains questions about current learning, meaningful work, and what comes next.

### Nested follow-up questions — inside `hobbies`

A question can have a `followUps` property:

```js
{
  question: "What kind of games do you like?",
  answer: "...",
  followUps: [
    {
      question: "What are some of the games that you like?",
      answer: "...",
    },
  ],
}
```

`followUps` is another array of question objects using the same structure. Because a follow-up question can also have its own `followUps`, the dialogue can branch more than one level deep. The code does not have to hard-code each possible question; it reads these objects and creates buttons from them.

## 3. Connecting JavaScript to the HTML — lines 122–137

For example:

```js
const modal = document.getElementById("story-modal");
const closeModalButton = document.querySelector(".modal-close");
const storyButtons = document.querySelectorAll(".story-card");
```

- `document` represents the current web page.
- `getElementById("story-modal")` searches for the single HTML element with that `id`.
- `querySelector(".modal-close")` finds the first element matching the CSS selector. The dot means `modal-close` is a class.
- `querySelectorAll(".story-card")` finds every element with that class and returns a collection.
- The result of a lookup can be `null` if the element is missing. Later `if` checks protect code that needs an element before using it.

The remaining constants in this section do the same kind of lookup for the modal title, text, transcript, choices, prompt, completion message, quest counter, progress bar, progress fill, and inventory pills.

## 4. Values that change while the page runs — lines 139–144

```js
const unlockedStories = new Set();
let lastFocusedElement = null;
let replyTimeout = null;
let typingTimeout = null;
const replyDelay = 1600;
const typingSpeed = 18;
```

- `new Set()` creates a collection of unique values. The script puts a chapter key in it the first time the chapter is opened. A chapter cannot be counted twice.
- `let` is used for variables whose values will change. `lastFocusedElement` will later hold the element that had keyboard focus before the modal opened.
- The timeout variables start as `null`. When the script schedules a timer, it saves the timer ID here so the timer can be cancelled later.
- `replyDelay` is the pause before the answer starts, in milliseconds. `1600` milliseconds is 1.6 seconds.
- `typingSpeed` is the delay between characters during the typing effect, also in milliseconds.

## 5. Setting the year — lines 146–148

```js
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
```

- `if (yearElement)` checks that the earlier HTML lookup found an element. A missing element is `null`, which is false in a condition.
- `new Date()` creates a date using the visitor’s current date and time.
- `.getFullYear()` extracts its four-digit year.
- `.textContent = ...` replaces the text inside the year element with that number.

## 6. Rotating the subheading — lines 150–164

The outer `if (targetElement)` means this feature only runs if the page has an element with the `rotating-text` ID. Inside it, `currentIndex` keeps track of which array item is currently selected.

```js
currentIndex = (currentIndex + 1) % subheadings.length;
targetElement.textContent = subheadings[currentIndex];
```

- `currentIndex + 1` moves to the next array position.
- `% subheadings.length` takes the remainder after division by the array length. That keeps the index in range: after the last item, the remainder becomes `0`, returning to the first item.
- `subheadings[currentIndex]` reads the selected string from the array.
- Assigning it to `textContent` changes the visible heading.

Before changing the heading, the function removes the animation class. Reading `targetElement.offsetWidth` forces the browser to recalculate the element’s layout; this lets adding the class again restart the animation. The function then adds the class back.

```js
setInterval(changeSubheading, 3000);
```

`setInterval` asks the browser to call `changeSubheading` repeatedly, every 3000 milliseconds (3 seconds). The animation class is also added once before the interval starts, so the initial heading can animate too.

## 7. Updating quest progress — lines 166–193

```js
const total = storyButtons.length;
const unlockedCount = unlockedStories.size;
const progress = (unlockedCount / total) * 100;
```

- `.length` counts the story-card elements found in the HTML.
- `.size` counts the unique chapter keys in the set.
- Dividing the number unlocked by the total and multiplying by 100 produces the progress percentage.

The following `if` blocks update the parts of the quest board, but only when each corresponding HTML element exists:

- `questCounter.textContent` displays a count such as `2 / 4 unlocked`.
- `progressFill.style.width` sets the fill element’s CSS width to the computed percentage.
- `setAttribute("aria-valuemax", String(total))` and `setAttribute("aria-valuenow", String(unlockedCount))` update accessibility information on the progress bar. `String(...)` converts the numbers to text because HTML attributes are strings.

The nested `if`/`else if`/`else` chooses one status message:

1. When `unlockedCount === 0`, tell the visitor to explore the archive.
2. When `unlockedCount === total`, show the all-quests-complete message.
3. Otherwise, show how many chapters are unlocked.

`===` compares values without converting their types. The template string in the final message uses backticks and `${...}` to insert the count. The `${unlockedCount > 1 ? "s" : ""}` part is a conditional expression: it inserts an `s` when the count is greater than one, so the message says “chapters” instead of “chapter.”

## 8. Activating the matching trait — lines 195–201

```js
inventoryPills.forEach((pill) => {
  if (pill.dataset.pill === key) {
    pill.classList.add("active");
  }
});
```

- `forEach` runs the callback once for every inventory pill.
- `pill.dataset.pill` reads the pill’s `data-pill` HTML attribute.
- The `if` compares that value with the chapter `key`.
- For a match, `classList.add("active")` adds a CSS class, allowing the page’s styles to show the trait as unlocked.

## 9. Making a question button — lines 203–212

```js
function createDialogueChoice(item, isFollowUp = false) {
```

This declares a function with two inputs: `item` is a question object, and `isFollowUp` tells the function whether the question is a follow-up. `= false` is a default value, used when the caller does not supply the second input.

```js
const choice = document.createElement("button");
choice.className = isFollowUp
  ? "dialogue-choice dialogue-choice-followup"
  : "dialogue-choice";
```

- `createElement("button")` builds a new button in memory; it is not on the page until it is added to an existing element.
- `condition ? valueA : valueB` is the ternary operator. It chooses the follow-up styling classes when `isFollowUp` is true; otherwise, it uses the regular choice class.

The next statements set the button’s type and its visible label. Setting `type` to `"button"` prevents it from acting as a form-submit button if it is inside a form.

```js
choice.addEventListener("click", () => answerStory(item, choice));
return choice;
```

The click listener calls `answerStory` with the question data and the button that was clicked. `return choice` gives the newly built button back to the code that called this function.

## 10. Preparing and opening a chapter — lines 214–256

### Check that the modal is usable

`openStory(key)` receives a chapter key, such as `"origin"`. Its first `if` checks each required modal element with `!`, meaning “is missing.” The `||` operators mean “or.” If any required element is missing, the function uses `return` to stop before trying to update an element that is not there.

```js
const content = storyContent[key];
if (!content) return;
```

Bracket notation looks up the chapter whose key is held in the `key` variable. If there is no matching chapter, the function stops.

### Cancel old timers and record the unlock

`clearTimeout(replyTimeout)` and `clearTimeout(typingTimeout)` cancel timers left over from earlier dialogue. The variables are then reset to `null`, marking that no timer is currently active.

```js
if (!unlockedStories.has(key)) {
  unlockedStories.add(key);
  updateQuestBoard();
  unlockStoryTrait(key);
}
```

- `.has(key)` checks whether this chapter is already in the set. `!` reverses that result, so the block runs only for a first-time unlock.
- `.add(key)` records it.
- The quest display and matching trait are updated immediately.
- Reopening an already-unlocked chapter does not add it or repeat those updates.

### Fill in the modal and show it

`document.activeElement` is the element currently focused by the keyboard or browser. Saving it in `lastFocusedElement` allows `closeStory()` to restore focus later.

The next assignments place the chapter title and intro into their elements. `replaceChildren(modalText)` clears the transcript and then puts the intro text element back inside it. `replaceChildren()` with no arguments clears all existing question buttons. The prompt is reset, and adding the `"hidden"` class hides the completion message.

```js
content.questions.forEach((item) => {
  dialogueChoices.appendChild(createDialogueChoice(item));
});
```

For each question in the chapter, this creates a button and appends it to the choices element. `appendChild` inserts the new button into the page.

The modal then has `"hidden"` removed so it can be displayed. Its `aria-hidden` attribute is set to `"false"` for assistive technology, and `"modal-open"` is added to the body so CSS can adjust the page while the modal is open.

```js
dialogueChoices.querySelector("button")?.focus();
```

This finds the first question button and focuses it. `?.` is optional chaining: if there is no button, JavaScript skips `.focus()` instead of throwing an error.

## 11. Showing the visitor’s question and answer — lines 258–348

`answerStory(item, choice)` receives the chosen question object and its button. Its first `if` checks that the transcript, choices, completion message, and prompt all exist. If one is missing, it returns without continuing.

### Add the selected question and a thinking status

```js
const question = document.createElement("p");
question.className = "dialogue-line visitor-line";
question.textContent = item.question;
```

These statements create a paragraph, assign CSS classes that style it as the visitor’s line, and put the selected question text inside it.

`choice.remove()` removes the clicked question button because it has already been answered. The `forEach` that follows visits each remaining button and sets `disabled = true`, preventing another question from being selected while the answer is being prepared.

The script creates another paragraph for the “AC is thinking” status. Its classes control its appearance. `setAttribute("role", "status")` marks it as a status update for assistive technology, and the `aria-label` gives it an accessible label. A `<span>` for the dots is created, marked `aria-hidden="true"` so screen readers do not announce decorative punctuation, and appended to the status paragraph.

```js
dialogueTranscript.append(question, thinking);
dialogueTranscript.scrollTop = dialogueTranscript.scrollHeight;
closeModalButton?.focus();
```

- `append` adds both paragraphs to the transcript in the given order.
- Setting `scrollTop` to `scrollHeight` scrolls the transcript to its bottom so the newest dialogue is visible.
- Optional chaining focuses the close button if it exists.

### Wait, then display the answer

```js
replyTimeout = window.setTimeout(() => {
  ...
}, replyDelay);
```

`setTimeout` runs its callback once after `replyDelay` milliseconds. The returned timer ID is saved in `replyTimeout` so `closeStory()` can cancel it. When the callback begins, `replyTimeout` is reset to `null`. If the modal has been closed during the delay, the callback returns without adding an answer.

The callback creates a paragraph for the answer, gives it the dialogue and typing-effect classes, and stores the complete answer in its `aria-label`. Its visible text starts empty. `thinking.replaceWith(answer)` replaces the thinking status with this answer paragraph.

```js
const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let characterIndex = 0;
```

`matchMedia` asks whether the visitor’s system/browser requests reduced motion. `.matches` is `true` when that preference applies. `characterIndex` tracks the next character to reveal.

### Reveal the answer one character at a time

`typeNextCharacter()` is a function inside the timer callback. It can use `answer`, `item`, and `characterIndex` from the surrounding callback.

1. If the modal is hidden, the function clears the saved typing timer ID and stops.
2. If `characterIndex < item.answer.length`, there are still characters to show.
3. `item.answer.charAt(characterIndex)` reads the next character. `+=` appends it to the answer paragraph’s current text.
4. The index increases by one, the transcript scrolls to the bottom, and `setTimeout(typeNextCharacter, typingSpeed)` schedules the next character.
5. `return` stops this run of the function; the next character is handled by the scheduled run.

When there are no characters left, the function removes `"typing-answer"` so the typing animation styling ends and resets `typingTimeout` to `null`.

### Add follow-up questions and finish the dialogue

```js
if (item.followUps?.length) {
```

Optional chaining safely checks the `length` of `followUps` only if that property exists. If there are follow-ups, the script copies the array with `[...item.followUps]`, reverses the copy, and inserts each generated button at the beginning of the choices. Reversing first means that repeated insertion at the beginning preserves the original follow-up order.

The prompt changes to invite more questions. If there are no follow-ups and no existing follow-up buttons, the `else if` updates the prompt to either invite another chapter question or say that the whole story has been heard. `querySelector(...)` returns the first matching button, or `null` if none exists; JavaScript treats a found element as true and `null` as false in the ternary condition.

The next `if` looks for the next available button:

- If one exists, every question button is enabled again and the first one is focused.
- If none exists, the completion message is shown by removing `"hidden"`, and the close button receives focus.

### Respect reduced-motion preference

When `prefersReducedMotion` is true, the complete answer is put into the paragraph at once and `characterIndex` is set to its length. Calling `typeNextCharacter()` then skips the character-adding branch and runs the normal completion steps immediately. Otherwise, the function starts the character-by-character effect normally.

## 12. Closing the chapter — lines 350–360

```js
function closeStory() {
  if (!modal) return;
```

If the modal element does not exist, there is nothing to close, so the function returns.

It then cancels both pending timers and resets their variables to `null`. This prevents a delayed answer or typing callback from continuing after the modal closes.

`classList.add("hidden")` hides the modal. Setting `aria-hidden` to `"true"` communicates that it is hidden to assistive technology. Removing `"modal-open"` from the body restores the page’s normal state. Finally, `lastFocusedElement?.focus()` returns focus to the element that was active before the chapter opened, if that element still exists.

## 13. Making each story card clickable — lines 362–367

`storyButtons.forEach(...)` registers a click handler on every story card. When a card is clicked:

- `button.dataset.story` reads its `data-story` attribute; that value selects the chapter passed to `openStory`.
- `button.classList.add("is-unlocked")` applies the card’s unlocked styling.

## 14. Close-button click handler — lines 369–371

`if (closeModalButton)` checks that the close button exists. If it does, `addEventListener` registers `closeStory` as its click handler. Passing the function name means the browser calls it when the click occurs.

## 15. Clicking the backdrop — lines 373–379

The script adds a click listener to the modal. A click event bubbles up from the clicked element to its ancestors, including the modal. `event.target` is the element where the click originally happened. The condition `event.target === modal` is true only when the backdrop itself was clicked, not when the click began inside the modal content. Only a backdrop click calls `closeStory()`.

## 16. Keyboard behavior — lines 381–399

The document-level `keydown` listener receives keyboard events from the page. It checks two keys, and both actions only apply when the modal exists and is currently visible.

```js
if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
  closeStory();
}
```

This closes the modal when the pressed key is Escape. `classList.contains("hidden")` checks whether the modal is hidden; `!` means this condition requires it to be visible.

For Tab navigation, `querySelectorAll("button:not(:disabled)")` collects enabled buttons inside the modal. In this CSS selector, `:not(:disabled)` excludes disabled buttons. The first and last entries are saved so focus can loop around the modal:

- If **Shift+Tab** is pressed while focus is on the first enabled button, `preventDefault()` stops the browser’s normal focus movement and focus is sent to the last button.
- If **Tab** is pressed while focus is on the last enabled button, normal movement is stopped and focus is sent to the first button.

This keeps keyboard navigation inside the open modal.

## 17. Set the initial quest display — line 401

```js
updateQuestBoard();
```

This calls the function once as the script finishes loading. It initializes the quest count, progress bar, and message before the visitor opens a chapter.
