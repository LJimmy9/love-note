import { atom } from "jotai";

export const $currAnimation = atom<string>("");
export const $isAnimating = atom<boolean>(false);

export const $toggleAnimating = atom(null, (_, set, value: boolean) => {
  set($isAnimating, value);
});

export const $playAnimation = atom(null, (get, set, value: string) => {
  const currAnim = get($currAnimation);
  if (currAnim == value) {
    return;
  }
  set($toggleAnimating, true);
  set($currAnimation, value);
});

export const $doneAnimating = atom(null, (_get, set) => {
  set($toggleAnimating, false);
  Rune.actions.animationDone();
  set($currAnimation, "");
});
