import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError("Error al enviar el email de recuperación");
        return;
      }

      setEmailSent(true);
      toast.success("Email de recuperación enviado");
    } catch (err) {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img 
                src="/src/assets/estarter-logo.png" 
                alt="Logo" 
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Email Enviado</h1>
            <p className="text-muted-foreground">Revisa tu bandeja de entrada</p>
          </div>

          <Card className="border-border shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-success" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">¡Email enviado correctamente!</h3>
                  <p className="text-sm text-muted-foreground">
                    Hemos enviado un enlace para restablecer tu contraseña al email proporcionado.
                    Revisa tu bandeja de entrada y sigue las instrucciones.
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/ingresar">
                    <Button className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">
                  ¿No recibiste el email? Revisa tu carpeta de spam o inténtalo de nuevo en unos minutos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img 
              src="/src/assets/estarter-logo.png" 
              alt="Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Recuperar Contraseña</h1>
          <p className="text-muted-foreground">Ingresa tu email para recuperar tu cuenta</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription className="text-center">
              No te preocupes, te enviaremos un enlace para restablecerla
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tu@email.com"
                          type="email"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Enlace de Recuperación
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-border">
                  <Link
                    to="/ingresar"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;