import { createTheme } from "@mui/material/styles";

/**
 * Brand theme derived from the ProRiski Figma (Dev Mode inspect of the
 * calculator panel). Colors are mirrored in `_tokens.scss` for the SCSS layer.
 */
const BRAND = {
  green: "#329a85",
  greenDark: "#2b8472",
  red: "#cb4a4a",
  amber: "#e0922f",
  ink: "#4a4a4a",
  title: "#828282",
  muted: "#bdbdbd",
  border: "#f0f0f0",
  borderHover: "#d8d8d8",
  surface: "#fdfdfd",
  page: "#f4f5f6",
} as const;

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: BRAND.green, dark: BRAND.greenDark, contrastText: "#fdfdfd" },
    error: { main: BRAND.red },
    success: { main: BRAND.green },
    warning: { main: BRAND.amber },
    text: { primary: BRAND.ink, secondary: BRAND.muted },
    divider: BRAND.border,
    background: { default: BRAND.page, paper: BRAND.surface },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: "var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    h1: { fontSize: 20, fontWeight: 600 },
    body2: { fontSize: 14 },
    button: { textTransform: "none", fontWeight: 400 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingBlock: 9,
          fontSize: 16,
          fontWeight: 400,
          transition: "background-color .15s ease, transform .05s ease",
          "&:active": { transform: "translateY(1px)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: BRAND.surface,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.border },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.borderHover },
        },
        input: { padding: "9px 12px", fontSize: 16, color: BRAND.ink },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": { color: BRAND.muted, opacity: 1 },
        },
      },
    },
  },
});
