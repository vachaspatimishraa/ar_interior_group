"use client";

import { useCallback, useMemo, useReducer } from "react";

export type PreviewSelectionState = {
  selectedIndex: number;
  hoveredIndex: number | null;
  focusedIndex: number | null;
};

export type PreviewSelectionAction =
  | { type: "select"; index: number }
  | { type: "hover"; index: number }
  | { type: "leave"; index: number }
  | { type: "focus"; index: number }
  | { type: "blur"; index: number };

export function previewSelectionReducer(state: PreviewSelectionState, action: PreviewSelectionAction): PreviewSelectionState {
  switch (action.type) {
    case "select":
      return { ...state, selectedIndex: action.index };
    case "hover":
      return state.hoveredIndex === action.index && state.focusedIndex === null
        ? state
        : { ...state, hoveredIndex: action.index, focusedIndex: null };
    case "leave":
      return state.hoveredIndex === action.index ? { ...state, hoveredIndex: null } : state;
    case "focus":
      return state.focusedIndex === action.index && state.hoveredIndex === null
        ? state
        : { ...state, focusedIndex: action.index, hoveredIndex: null };
    case "blur":
      return state.focusedIndex === action.index ? { ...state, focusedIndex: null } : state;
  }
}

export function getPreviewIndex(state: PreviewSelectionState) {
  return state.focusedIndex ?? state.hoveredIndex ?? state.selectedIndex;
}

export function usePreviewSelection(initialIndex = 0) {
  const [state, dispatch] = useReducer(previewSelectionReducer, {
    selectedIndex: initialIndex,
    hoveredIndex: null,
    focusedIndex: null,
  });
  const select = useCallback((index: number) => dispatch({ type: "select", index }), []);
  const hover = useCallback((index: number) => dispatch({ type: "hover", index }), []);
  const leave = useCallback((index: number) => dispatch({ type: "leave", index }), []);
  const focus = useCallback((index: number) => dispatch({ type: "focus", index }), []);
  const blur = useCallback((index: number) => dispatch({ type: "blur", index }), []);
  const previewIndex = getPreviewIndex(state);

  const handlers = useMemo(() => (index: number) => ({
    onMouseEnter: () => hover(index),
    onMouseLeave: () => leave(index),
    onFocus: () => focus(index),
    onBlur: () => blur(index),
    onClick: () => select(index),
  }), [blur, focus, hover, leave, select]);

  return { ...state, previewIndex, select, preview: hover, clearPreview: leave, focus, blur, handlers };
}
