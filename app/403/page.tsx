"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";

const ForbiddenPage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md text-center">
        <Image
          priority
          alt="403 Forbidden"
          className="self-center"
          height={500}
          src="/403.svg"
          width={500}
        />
        <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
        <p className="mb-6">
          Sorry, you don’t have permission to access this page. If you believe this is a mistake, please contact the administrator.
        </p>
        <Link href="/">
          <Button variant="ghost">
            Go Back to Homepage
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ForbiddenPage;
