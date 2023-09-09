'use client'
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database} from "@/database.types";
import Link from "next/link";
import {HomeIcon, RocketLaunchIcon} from "@heroicons/react/20/solid";
import LogoutButton from "@/components/LogoutButton";
import React from "react";
import {User} from "@supabase/supabase-js";
import {isAsyncFunction} from "util/types";

export default function () {
    const supabase = createClientComponentClient<Database>()
    const [user,setUser]=React.useState<User|null>(null)
    React.useEffect(()=>{
        async function getUser(){
            const {
                data: {user},
            } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    },[supabase])

    return (
        <nav className="w-full flex border-b border-b-foreground/10 h-16 mb-4">
            <div className="w-full flex justify-between  items-center p-3 text-sm text-foreground">
                <div className={"flex gap-8"}>
                    <Link className="flex items-center" href="/"><HomeIcon className={"w-6 text-primary"}/>Home</Link>
                    <Link className="flex items-center" href="/admin/attributes"><RocketLaunchIcon
                        className={"w-6 text-primary"}/>Admin</Link>
                </div>

                {user ? (<div className="flex items-center gap-4">
                    <LogoutButton/>
                </div>) : (<Link
                    href="/login"
                    className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                >
                    Login
                </Link>)}
            </div>
        </nav>
    )
}