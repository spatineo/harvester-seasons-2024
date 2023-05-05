import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { RootDispatch, RootState } from './store';

export const useRootDispatch = () => useDispatch<RootDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
