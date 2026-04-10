"use client";

import { useReducer } from "react";

export interface WizardState {
  step: number;
  serviceId: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  endDate: string | null;
  selectedCatIds: string[];
  selectedAddonIds: string[];
  notes: string;
  isSubmitting: boolean;
}

type WizardAction =
  | { type: "SET_SERVICE"; serviceId: string }
  | { type: "SET_DATETIME"; date: string; time: string; endDate?: string }
  | { type: "SET_CATS"; catIds: string[] }
  | { type: "TOGGLE_CAT"; catId: string }
  | { type: "TOGGLE_ADDON"; addonId: string }
  | { type: "SET_NOTES"; notes: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "RESET" };

const initialState: WizardState = {
  step: 1,
  serviceId: null,
  scheduledDate: null,
  scheduledTime: null,
  endDate: null,
  selectedCatIds: [],
  selectedAddonIds: [],
  notes: "",
  isSubmitting: false,
};

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_SERVICE":
      return { ...state, serviceId: action.serviceId };
    case "SET_DATETIME":
      return {
        ...state,
        scheduledDate: action.date,
        scheduledTime: action.time,
        endDate: action.endDate || null,
      };
    case "SET_CATS":
      return { ...state, selectedCatIds: action.catIds };
    case "TOGGLE_CAT": {
      const catIds = state.selectedCatIds.includes(action.catId)
        ? state.selectedCatIds.filter((id) => id !== action.catId)
        : [...state.selectedCatIds, action.catId];
      return { ...state, selectedCatIds: catIds };
    }
    case "TOGGLE_ADDON": {
      const addonIds = state.selectedAddonIds.includes(action.addonId)
        ? state.selectedAddonIds.filter((id) => id !== action.addonId)
        : [...state.selectedAddonIds, action.addonId];
      return { ...state, selectedAddonIds: addonIds };
    }
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useBookingWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
