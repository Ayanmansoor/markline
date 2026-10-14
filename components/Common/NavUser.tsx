'use client'
import React, { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/Contexts/Auth.context";
import LoginModal from "./LoginModal";

function NavUser() {
  const { user, loading } = useAuth();
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleClick = () => {
    if (loading) return;
    if (!user) {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-start cursor-pointer hover:opacity-70 transition-opacity">
        {user ? (
          <Link href="/user">
            <User height={23} width={23} className="text-primary" />
          </Link>
        ) : (
          <button onClick={handleClick} aria-label="Account">
            <User height={23} width={23} className="text-primary" />
          </button>
        )}
      </div>

      <LoginModal isOpen={isLoginOpen} setIsOpen={setLoginOpen}>
        <></>
      </LoginModal>
    </>
  );
}

export default NavUser;


