const lightControl = (base, state) => ({
  ...base,
  minHeight: "40px",
  border: "1px solid #e2e8f0",
  boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 74, 163, 0.2)" : "none",
  borderRadius: "0.5rem",
  backgroundColor: "#ffffff",
});

const darkControl = (base, state) => ({
  ...base,
  minHeight: "40px",
  border: "1px solid #475569",
  boxShadow: state.isFocused ? "0 0 0 2px rgba(56, 189, 248, 0.2)" : "none",
  borderRadius: "0.5rem",
  backgroundColor: "#334155",
});

/** Light theme styles (default). */
export const customStyles = {
  control: lightControl,
  valueContainer: (base) => ({
    ...base,
    padding: "6px 10px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: "0.375rem",
  }),
  input: (base) => ({ ...base, color: "#1e293b" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8" }),
  menu: (base) => ({ ...base, backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }),
  menuList: (base) => ({ ...base, backgroundColor: "#ffffff" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f1f5f9" : "#ffffff",
    color: "#1e293b",
  }),
};

/** Returns react-select styles for the given theme. Use in components: getSelectStyles(theme === 'dark'). */
export function getSelectStyles(isDark) {
  if (!isDark) return customStyles;
  return {
    control: darkControl,
    valueContainer: (base) => ({
      ...base,
      padding: "6px 10px",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#475569",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base) => ({ ...base, color: "#e2e8f0" }),
    multiValueRemove: (base) => ({ ...base, color: "#e2e8f0" }),
    input: (base) => ({ ...base, color: "#e2e8f0" }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    singleValue: (base) => ({ ...base, color: "#e2e8f0" }),
    menu: (base) => ({ ...base, backgroundColor: "#334155", border: "1px solid #475569" }),
    menuList: (base) => ({ ...base, backgroundColor: "#334155" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#475569" : "#334155",
      color: "#e2e8f0",
    }),
    indicatorSeparator: (base) => ({ ...base, backgroundColor: "#475569" }),
    dropdownIndicator: (base) => ({ ...base, color: "#94a3b8" }),
  };
}
