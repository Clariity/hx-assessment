## Imports

React doesn't need to be imported as we are using React v17

However `eslint(react/react-in-jsx-scope)` is on and I didn't want to mess with the linting rules.

## Prop Types

I changed the following types from

```tsx
rowHeight: number | ((index: number) => number);
columnWidth: number | ((index: number) => number);
```

to

```tsx
rowHeight: number;
columnWidth: number;
```

as `useNumberParameter` in `App.tsx` only ever returns a `number` for the prop passed, it's never a function in the code available.

As a result, a lot of code and checks in `Virtualizer.tsx` could also be removed.

If however that functionality was needed in the future (for example, having rows with differing heights) then to save constant checking I would add a function to always use those props as functions.

```tsx
const castToNumberGenerator = (
  prop: number | ((index: number) => number)
): ((index: number) => number) => {
  if (typeof prop === "function") {
    return prop;
  } else {
    return () => prop;
  }
};
```

However, when running `onScroll`, we would have to assume that if passed an empty param it would give a default height/width value (or we can just assume it's the height/width of the first row/column).

## Check functions and Prop Destructuring

`checkNumberProp`, `checkNumberOrFunctionProp`, `checkFunctionProp` are all unnecessary checks as we are using TypeScript and we can also provide default values in our destructured props.

## Removal of React.memo()

As the children props are functions, React.memo() won't prevent any re-renders as functions aren't referentially equal. I tested this by running an interval in App.tsx and logging in Virtualizer, and with the same props it still re-called Virtualizer.

https://twitter.com/aweary/status/1230594484347396097?lang=en-GB

## Initial Visible Rows

The default was set so that only 0,0 was visible, even with input values set such that others should be visible. So I updated the useState initialisers to use the correct values to show the grid.

## Added useEffect and useRef

Added a useEffect to update the visible rows when the input fields are changed so that you don't have to wait to scroll to see the new grid.

Also added a ref to the scroll so the same scroll values can be kept when updating in the useEffect. To prevent code duplication I extracted the visible row/column updating into a function that is called in both the onScroll and the useEffect.

## Visible Rows

There was an off by 1 error. So for seeing the first 4 rows, it was showing up to index 4, which is 5 rows (0,1,2,3,4)

Additionally it would show as many rows that could fit in the container, even if there were less rows described (e.g. 4 rows described, 100 height, 800 height container, it would show 8 x 100 rows, instead of just the first 4 rows)

For partially visible rows

- Math.floor 'first' and Math.ceil 'last'

For only fully visible rows

- Math.ceil 'first' and Math.floor 'last'

## totalHeight and totalWidth

These values were being stored as consts but not used more than once, with such a minimal calculation with all the clearups, these didn't need to be stored in storage so I simply added them to the jsx

```
height: numRows * rowHeight,
width: numColumns * columnWidth,
```

## Visual

I also set the background colour of the scroll container to blue so that I could see it.
