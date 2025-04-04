
// src/components/ui/popover.jsx
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const PopoverContext = createContext();

export const Popover = ({ children }) => {
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
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative" ref={wrapperRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ children }) => {
  const { setOpen } = useContext(PopoverContext);
  return (
    <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
      {children}
    </div>
  );
};

export const PopoverContent = ({ children }) => {
  const { open } = useContext(PopoverContext);
  if (!open) return null;
  return (
    <div className="absolute z-20 mt-2 bg-white border rounded shadow p-2">
      {children}
    </div>
  );
};