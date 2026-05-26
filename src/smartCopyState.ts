type MaybePromise<T> = T | PromiseLike<T>;

export const SMART_COPY_CONFIGURATION_SECTION = 'code-ref';
export const SMART_COPY_CONFIGURATION_KEY = 'smartCopy.enabled';
export const SMART_COPY_CONFIGURATION_FULL_KEY = `${SMART_COPY_CONFIGURATION_SECTION}.${SMART_COPY_CONFIGURATION_KEY}`;
export const SMART_COPY_CONTEXT_KEY = 'code-ref.smartCopyEnabled';

export interface SmartCopyStateControllerDependencies {
  getEnabled: () => boolean;
  updateEnabled: (enabled: boolean) => MaybePromise<void>;
  setContext: (key: string, enabled: boolean) => MaybePromise<void>;
  updateStatus: (enabled: boolean) => void;
}

export interface SmartCopyStateController {
  syncFromConfiguration: () => Promise<boolean>;
  toggle: () => Promise<boolean>;
}

export function createSmartCopyStateController(
  deps: SmartCopyStateControllerDependencies,
): SmartCopyStateController {
  async function applyEnabled(enabled: boolean): Promise<boolean> {
    await deps.setContext(SMART_COPY_CONTEXT_KEY, enabled);
    deps.updateStatus(enabled);
    return enabled;
  }

  return {
    syncFromConfiguration: () => applyEnabled(deps.getEnabled()),
    toggle: async () => {
      const enabled = !deps.getEnabled();
      await deps.updateEnabled(enabled);
      return applyEnabled(enabled);
    },
  };
}
