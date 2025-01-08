import React from "react";
import { PhoneLoginForm } from "@/components/PhoneLoginForm";
import { WavveLogo } from "@/components/WavveLogo";
import { Feature } from "@/components/Feature";

export function Login() {
  return (
    <main className="grid lg:grid-cols-2 min-h-screen">
      <div className="bg-[#F9F5FF]">
        <div className="p-6">
          <WavveLogo />
        </div>
        <div className="space-y-16 p-8">
          <Feature
            title={
              <>
                <span className="text-purple-600">Easy</span> to Use,{" "}
                <span className="text-purple-600">Effortless</span> to Navigate.
              </>
            }
            description="Seamless, user-friendly interface for effortless navigation."
            imageSrc="/placeholder.svg?height=160&width=160"
          />
          <Feature
            title={
              <>
                Stay Updated with{" "}
                <span className="text-purple-600">Timely</span> Alerts.
              </>
            }
            description="Stay on top with smart notifications for appointments and updates."
            imageSrc="/placeholder.svg?height=160&width=160"
          />
          <Feature
            title={
              <>
                <span className="text-purple-600">Streamline</span> Bookings,
                Track <span className="text-purple-600">Appointments</span>.
              </>
            }
            description="Effortlessly manage and track appointments with our intuitive system."
            imageSrc="/placeholder.svg?height=160&width=160"
          />
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Wavve
            </h1>
            <p className="text-muted-foreground">
              Join us to streamline your salon operations effortlessly.
            </p>
          </div>
          <PhoneLoginForm />
        </div>
      </div>
    </main>
  );
}
