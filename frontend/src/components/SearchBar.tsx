interface Props {
    value: string;
    onChange: (val: string) => void;
  }
  
  const SearchBar = ({ value, onChange }: Props) => {
    return (
      <input
        type="text"
        placeholder="Search images..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, width: "100%", marginBottom: 20 }}
      />
    );
  };
  
  export default SearchBar;
  