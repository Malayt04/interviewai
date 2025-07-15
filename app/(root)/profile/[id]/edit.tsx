import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProfilePage() {
  // Hardcoded user data for UI demo
  const user = {
    name: "Jane Doe",
    email: "jane.doe@email.com",
    role: "Frontend Developer",
    bio: "Passionate about building beautiful and performant web apps. Loves React, TypeScript, and UI/UX design.",
    avatar: "/user-avatar.png",
  };

  return (
    <section className="max-w-2xl mx-auto bg-white dark:bg-dark-200 rounded-2xl shadow-lg p-8 mt-12 flex flex-col gap-8">
      <h2 className="text-3xl font-bold text-primary-100 dark:text-primary-200 mb-2">
        Edit Profile
      </h2>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <Image
              src={user.avatar}
              alt="Profile picture"
              width={100}
              height={100}
              className="rounded-full object-cover border-4 border-primary-200 shadow-md"
            />
            <div className="mt-2 flex flex-col items-center">
              <label
                htmlFor="avatar-upload"
                className="text-sm text-light-400 cursor-pointer underline"
              >
                Change Avatar
              </label>
              <input id="avatar-upload" type="file" className="hidden" />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-light-600">Name</span>
              <Input
                type="text"
                defaultValue={user.name}
                className="!bg-light-100 !text-dark-100 !rounded-lg px-4 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-light-600">Email</span>
              <Input
                type="email"
                defaultValue={user.email}
                className="!bg-light-100 !text-dark-100 !rounded-lg px-4 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-light-600">Role</span>
              <Input
                type="text"
                defaultValue={user.role}
                className="!bg-light-100 !text-dark-100 !rounded-lg px-4 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </label>
          </div>
        </div>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-light-600">Bio</span>
          <textarea
            defaultValue={user.bio}
            rows={4}
            className="input !bg-light-100 !text-dark-100 !rounded-lg px-4 py-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
          />
        </label>
        <div className="flex gap-4 justify-end mt-4">
          <Link href="../" passHref legacyBehavior>
            <Button className="btn-secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button className="btn-primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
}
