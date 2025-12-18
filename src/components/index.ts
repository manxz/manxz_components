/**
 * Manxz Components
 * Lightweight, production-ready React Native component library
 * 
 * @packageDocumentation
 */

// Components
export { Button, type ButtonProps, type ButtonVariant } from './Button';
export { useButton, type UseButtonProps, type UseButtonReturn } from './Button/useButton';

export { Modal, type ModalProps } from './Modal';
export { useModal, type UseModalProps, type UseModalReturn } from './Modal/useModal';

export { Input, type InputProps } from './Input';
export { useInput, type UseInputProps, type UseInputReturn } from './Input/useInput';
export { InputAddress, type InputAddressProps } from './Input/InputAddress';
export { InputGroup, type InputGroupProps } from './Input/InputGroup';
export { InputMenu, type InputMenuProps } from './Input/InputMenu';
export { InputRadio, type InputRadioProps } from './Input/InputRadio';
export { InputSelect, type InputSelectProps } from './Input/InputSelect';
export { InputSelectRadio, type InputSelectProps } from './Input/InputSelectRadio';
export { InputSplit, type InputSplitProps } from './Input/InputSplit';

export { Calendar, type CalendarProps } from './Calendar';
export { CalendarWeek, type CalendarWeekProps } from './Calendar';
export { CalendarTimeSlot, type CalendarTimeSlotProps, type CalendarTimeSlotState } from './Calendar';

// Design System
export { COLORS, type ColorName } from '../styles/colors';
export { TYPOGRAPHY, FONT_FAMILIES, FONT_WEIGHTS, FONT_SIZES, type TypographyVariant } from '../styles/typography';

