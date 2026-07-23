"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/features/user";
import { fetchWpCurrentUser } from "@/app/features/user";

interface JwtData {
  ID: number;
  user_login: string;
  user_email: string;
  display_name: string;
  roles: string[];
}

function parseJwtData(t: string): JwtData | null {
  try {
    const raw = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const d = raw?.data;
    if (!d) return null;
    return {
      ID: Number(d.ID ?? d.id ?? 0),
      user_login: String(d.user_login ?? ""),
      user_email: String(d.user_email ?? ""),
      display_name: String(d.display_name ?? ""),
      roles: Array.isArray(d.roles) ? d.roles.map(String) : [],
    };
  } catch {
    return null;
  }
}

export function useProfile() {
  const token = useUserStore((s) => s.token);

  const [jwtData, setJwtData] = useState<JwtData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!token) return;

    const jwt = parseJwtData(token);
    if (jwt) {
      setJwtData(jwt);
      if (jwt.user_email) setEmail(jwt.user_email);
      if (jwt.display_name) {
        const parts = jwt.display_name.split(" ");
        setFirstName(parts[0] ?? jwt.display_name);
        setLastName(parts.slice(1).join(" "));
      }
    }

    let cancelled = false;
    setProfileLoading(true);
    void fetchWpCurrentUser().then((me) => {
      if (cancelled || !me) return;
      const fn = typeof me.first_name === "string" ? me.first_name : "";
      const ln = typeof me.last_name === "string" ? me.last_name : "";
      if (fn || ln) {
        setFirstName(fn || (me.name ?? ""));
        setLastName(ln);
      }
      if (typeof me.email === "string" && me.email) setEmail(me.email);
      const metaPhone = me.meta?.billing_phone ?? me.meta?.phone;
      if (typeof metaPhone === "string" && metaPhone) setPhone(metaPhone);
    }).finally(() => {
      if (!cancelled) setProfileLoading(false);
    });
    return () => { cancelled = true; };
  }, [token]);

  return {
    jwtData,
    profileLoading,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    email, setEmail,
    password, setPassword,
    newPassword, setNewPassword,
  };
}
