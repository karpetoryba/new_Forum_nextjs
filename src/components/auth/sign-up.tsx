"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createUserSchema } from "@/lib/auth/zod";

type SignUpFormState = {
  name: string;
  email: string;
  password: string;
};

type SignUpFormErrors = Partial<Record<keyof SignUpFormState, string>> & {
  form?: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpFormState>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof SignUpFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValues((previous) => ({ ...previous, [field]: nextValue }));
      setErrors((previous) => ({ ...previous, [field]: undefined, form: undefined }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = createUserSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      toast.error("Validation échouée", {
        description: "Vérifiez les informations fournies et réessayez.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({
            email: payload.error || "Un compte existe déjà avec cet email.",
          });
        } else if (response.status === 400 && payload?.details?.fieldErrors) {
          const fieldErrors = payload.details.fieldErrors as Record<string, string[]>;
          setErrors({
            name: fieldErrors.name?.[0],
            email: fieldErrors.email?.[0],
            password: fieldErrors.password?.[0],
            form: payload.error,
          });
        } else {
          setErrors({
            form: payload.error || "Impossible de créer le compte",
          });
        }

        toast.error(payload.error || "Impossible de créer le compte");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.success("Compte créé avec succès", {
          description: "Vous pouvez maintenant vous connecter.",
        });
        router.push("/signin");
        return;
      }

      toast.success("Inscription réussie", {
        description: "Vous êtes maintenant connecté.",
      });
      router.replace("/");
    } catch (error) {
      console.error("[SignUpForm]", error);
      toast.error("Une erreur est survenue");
      setErrors({
        form: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md border-none shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Créer un compte</CardTitle>
        <CardDescription>Renseignez vos informations pour rejoindre la plateforme.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
              Nom
            </label>
            <Input
              id="name"
              value={values.name}
              onChange={handleChange("name")}
              placeholder="Votre nom"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              placeholder="vous@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              placeholder="********"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              required
            />
            <p className="text-xs text-muted-foreground">
              8-32 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.
            </p>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {errors.form && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex items-center justify-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?
        <Button asChild variant="link" size="sm" className="px-1">
          <Link href="/signin">Se connecter</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

