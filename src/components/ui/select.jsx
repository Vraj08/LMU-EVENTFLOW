import React, { useState, useRef, useEffect, useContext, createContext } from 'react';

const SelectContext = createContext();

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ open, setOpen, value, onValueChange }}>
      <div className="relative w-full" ref={wrapperRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children }) => {
  const { setOpen } = useContext(SelectContext);
  return (
    <button
      className="w-full border p-2 rounded bg-white text-left"
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext);
  return (
    <span className="text-gray-900">
      {value || <span className="text-gray-500">{placeholder}</span>}
    </span>
  );
};

export const SelectContent = ({ children }) => {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div className="absolute z-10 w-full bg-white border rounded shadow mt-1">
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value }) => {
  const { setOpen, onValueChange } = useContext(SelectContext);
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
};
