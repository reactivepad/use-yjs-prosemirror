/*!
 * © 2021 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Command } from "prosemirror-state";
import { Transaction } from "prosemirror-state";

export enum TrackChangesAction {
  refreshChanges = "track-changes-refresh-changes",
  applyAndRemoveChanges = "track-changes-apply-remove-changes",
}

export type TrackChangesActionParams = {
  [TrackChangesAction.refreshChanges]: boolean;
  [TrackChangesAction.applyAndRemoveChanges]: boolean;
};

export const setActionTrackChanges = <
  K extends keyof TrackChangesActionParams & string
>(
  tr: Transaction,
  action: K,
  payload: TrackChangesActionParams[K]
) => tr.setMeta(action, payload);

/**
 * Appends a transaction that applies all 'accepted' and 'rejected' changes to the document.
 */
export const applyAndRemoveChanges = (): Command => (state, dispatch) => {
  dispatch &&
    dispatch(
      setActionTrackChanges(
        state.tr,
        TrackChangesAction.applyAndRemoveChanges,
        true
      )
    );
  return true;
};

/**
 * Runs `findChanges` to iterate over the document to collect changes into a new ChangeSet.
 */
export const refreshChanges = (): Command => (state, dispatch) => {
  dispatch &&
    dispatch(
      setActionTrackChanges(state.tr, TrackChangesAction.refreshChanges, true)
    );
  return true;
};

export const trackCommands = {
  applyAndRemoveChanges,
  refreshChanges,
};
