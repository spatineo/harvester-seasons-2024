/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSnackbar, VariantType } from 'notistack'
import { RootDispatch, RootState } from './store';

export const useRootDispatch = () => useDispatch<RootDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

let useSnackbarRef: any
export const SnackbarUtilsConfigurator: React.FC = () => {
  useSnackbarRef = useSnackbar()
  return null
}

export const EnqueueSnackbar = (message: string, variantText: VariantType) => {
  useSnackbarRef.enqueueSnackbar(`${message}`, { variant: `${variantText}` })
}
