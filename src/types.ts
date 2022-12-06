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
import { WebsocketProvider } from "y-websocket";
import { Doc } from "yjs";
import { EditorState, Transaction } from "prosemirror-state";

import type { yjsExtension } from "./extension";
import type { createYjsStore } from "./store";
import { EditorView } from "prosemirror-view";

export const yjsExtensionName = "yjs" as const;

export type YjsExtension = ReturnType<ReturnType<typeof yjsExtension>>;
export type YjsOptions = {
  document: {
    id: string;
  };
  user: YjsUser;
  initial?: {
    doc: Doc;
    provider: WebsocketProvider;
  };
  ws_url: string;
};

export type YjsStore = ReturnType<typeof createYjsStore>;
export interface YjsExtensionState {
  snapshots: YjsSnapshot[];
  selectedSnapshot: YjsSnapshot | null;
  currentUser: YjsUser;
  usersMap: Map<number, YjsUser>;
}
export enum YjsStatus {
  enabled = "enabled",
  disabled = "disabled",
}
export interface YjsUser {
  id: string;
  clientID: number;
  name: string;
  color: string;
}

export interface YjsSnapshot {
  id: string;
  date: number;
  snapshot: Uint8Array;
  clientID: number;
}

export type AwarenessChange = {
  added: number[];
  updated: number[];
  removed: number[];
};

export type Commands = { [name: string]: (...args: any[]) => Command };
export type CommandDispatch = (tr: Transaction) => void;
export type Command = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView
) => boolean;

export class EditorViewProvider {
  state?: EditorState;
  execCommand(applyAndRemoveChanges: Command) {}
}
export class ExtensionProvider {
  getExtension(yjsExtensionName: "yjs") {
    return undefined;
  }
  emitExtensionUpdate(yjsExtensionName: "yjs", state: YjsExtensionState) {}

  onExtensionUpdate(
    yjsExtensionName: "yjs",
    updateStateCb: (newState: YjsExtensionState) => void
  ) {}

  onUpdate(updateStoreCb: (provider: ExtensionProvider) => void) {}

  offExtensionUpdate(
    yjsExtensionName: "yjs",
    updateStateCb: (newState: YjsExtensionState) => void
  ) {}

  offUpdate(updateStoreCb: (provider: ExtensionProvider) => void) {}
}
export class PluginStateProvider {}

export const emptyProviders = {
  viewProvider: undefined,
  extensionProvider: undefined,
  pluginStateProvider: undefined,
};

export interface EditorProviders {
  viewProvider: EditorViewProvider;
  extensionProvider: ExtensionProvider;
  pluginStateProvider: PluginStateProvider;
}

export type EditorContext = EditorProviders | typeof emptyProviders;

export declare type CreateExtensionFn = (
  ...args: any[]
) => (ctx: EditorProviders) => Extension;
export declare type CreateExtension = (ctx: EditorProviders) => Extension;
export declare type Extension = {
  name: string;
  commands?: Commands;
  keymaps?: unknown[];
  plugins?: Plugin[];
  store?: Record<string, any>;
  onDestroy?: () => void;
};

export declare const applyAndRemoveChanges: () => Command;

export declare const refreshChanges: () => Command;

export const trackCommands = {
  applyAndRemoveChanges,
  refreshChanges,
};
