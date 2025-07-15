import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  // Hardcoded user data for UI demo
  const user = {
    name: "Jane Doe",
    email: "jane.doe@email.com",
    credits: 12,
    avatar: "/user-avatar.png",
    role: "Frontend Developer",
    joined: "Jan 15, 2024",
    bio: "Passionate about building beautiful and performant web apps. Loves React, TypeScript, and UI/UX design.",
  };

  return (
    <section className="max-w-2xl mx-auto bg-white dark:bg-dark-200 rounded-2xl shadow-lg p-8 mt-12 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <Image
            src={user.avatar}
            alt="Profile picture"
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-primary-200 shadow-md"
          />
        </div>
        <div className="flex flex-col gap-2 items-center sm:items-start">
          <h2 className="text-3xl font-bold text-primary-100 dark:text-primary-200">
            {user.name}
          </h2>
          <p className="text-light-400 text-lg">{user.role}</p>
          <Badge variant="outline" className="text-base px-4 py-1 mt-2">
            Credits: {user.credits}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-light-600">Email:</span>
          <span className="text-light-100">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-light-600">Joined:</span>
          <span className="text-light-100">{user.joined}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-primary-100 dark:text-primary-200">
          About
        </h3>
        <p className="text-light-100 leading-7">{user.bio}</p>
      </div>
      <div className="flex gap-4 justify-end">
        <Link href="./edit" passHref legacyBehavior>
          <Button className="btn-secondary">Edit Profile</Button>
        </Link>
        <Button className="btn-primary">Sign Out</Button>
      </div>
    </section>
  );
}
