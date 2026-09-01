'use client'
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import LoginModal from "./LoginModal";

function NavUser() {
  const [isUser, setUser] = useState<any>();
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      // getSession() reads from local JWT cache — instant, no network call
      const { data: { session } } = await mysupabase.auth.getSession();
      setUser(session?.user || null);
    }
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = mysupabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="flex items-center justify-start cursor-pointer hover:opacity-70 transition-opacity">
        {isUser ? (
          <Link href="/user">
            <User height={23} width={23} className="text-primary" />
          </Link>
        ) : (
          <button onClick={() => setLoginOpen(true)}>
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


