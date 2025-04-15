import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { SunMoon, MoonStar } from "lucide-react";
function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on page load
  useEffect(() => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode on button click
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new theme to localStorage
      if (newMode) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <Button onClick={toggleDarkMode} variant={"ghost"}>
      {darkMode ? (
        <div className="flex items-center">
          <SunMoon />
        </div>
      ) : (
        <div className="flex items-center">
          <MoonStar />
        </div>
      )}
    </Button>
  );
}

export default ThemeToggle;
