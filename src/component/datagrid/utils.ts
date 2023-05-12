import { RowData, TableOptions, TableOptionsResolved, createTable } from '@tanstack/table-core';

export function flexRender<TProps extends object>(
  Comp: ((props: TProps) => string) | string | undefined,
  props: TProps
) {
  if (!Comp) {
    return '';
  }
  return typeof Comp == 'function' ? Comp(props) : Comp;
}

export function useLitTable<TData extends RowData>(options: TableOptions<TData>) {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
    ...options,
  };

  const tableRef = { current: createTable<TData>(resolvedOptions) };
  const state = tableRef.current.initialState;

  tableRef.current.setOptions((prev) => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    onStateChange: (updater) => {
      options.onStateChange?.(updater);
    },
  }));

  return tableRef.current;
}
