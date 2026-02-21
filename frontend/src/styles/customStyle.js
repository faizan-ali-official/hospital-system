export const customStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    border: "1px solid #e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 74, 163, 0.2)" : "none",
    borderRadius: "0.5rem",
    backgroundColor: "#ffffff",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "6px 10px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#f1f5f9",
    borderRadius: "0.375rem",
  }),
};
