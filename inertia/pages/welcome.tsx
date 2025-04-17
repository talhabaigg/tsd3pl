import { PageProps } from "~/types";
import { Head, Link, usePage } from "@inertiajs/react";
import IssueForm from "~/components/issue-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import ApplicationLogo from "~/components/application-logo";


export default function Welcome({
  auth,
  laravelVersion,
  phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
  const { props } = usePage();
  const { flash = {} } = props as unknown as { flash: { success?: string } }; // Add a default value for flash
  const { isLoggedIn } = props as { isLoggedIn: boolean };
  console.log(isLoggedIn);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flash.success) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [flash.success]);

  return (
    <>
      <Head title="Welcome" />
      <div
        className="relative min-h-screen bg-gray-900  text-black/50  "
        
      >
        <header className="grid grid-cols-2 items-center gap-2 py-5 lg:grid-cols-3 bg-black px-6">
          <div className="flex lg:col-start-2 lg:justify-center ">
            <ApplicationLogo className="w-16 h-16" />
          </div>
          <nav className="-mx-3 flex flex-1 justify-end space-x-3">
            {auth.user ? (
              <Link
                href={route("dashboard")}
                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={route("login")}
                  className="rounded-md px-3 py-2  text-gray-200 ring-1 ring-transparent transition hover:text-gray-300 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                >
                  Log in
                </Link>
                <Link
                  href={route("register")}
                  className="rounded-md px-3 py-2  text-gray-200 ring-1 ring-transparent transition hover:text-gray-300  focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 ">
          <div className="relative w-full  ">
            <main className="mt-6 ">
              <div className="flex justify-center ">
                <div className="w-[500px]">
                  {loading && (
                    <div className="flex flex-col space-y-3 bg-gray-50 p-4 min-w-lg rounded-2xl ">
                      <Skeleton className="h-6" />
                      <Skeleton className="h-6" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="h-6 w-[400px]" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-[250px]" />
                        <Skeleton className="h-40 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-1/4" />
                      </div>
                    </div>
                  )}
                  {!loading && flash.success && (
                    <div className=" h-[500px] w-[400px]">
                      <Alert className="bg-green-200">
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                  {!flash.success && !loading && (
                    <div className="px-4 sm:px-0  ">
                      <h2 className="text-black font-default   text-left text-lg">
                        Submit a new issue to ROQ
                      </h2>
                      <div className="bg-gray-50 dark:bg-gray-500  p-4 rounded-lg  ">
                        <IssueForm issue={null} loggedIn={isLoggedIn} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>

            <footer className="py-16 text-center text-sm text-gray-700 dark:text-white/70">
              By Telp. Built with React and Laravel v{laravelVersion} (PHP v
              {phpVersion})
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
