import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/menu");
  }, [setLocation]);

  return null;
}
