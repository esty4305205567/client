/** המשתנים של בקשת תפיסה. label משמש להודעת ההתנגשות ("היריב חטף את <label>") */
export interface CaptureVariables {
  itemId: number;
  answer?: string;
  label: string;
}
