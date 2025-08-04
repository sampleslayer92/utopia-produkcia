import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  temporaryPassword?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, companyName, temporaryPassword }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', email);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Vitajte v Utopia Payment Platform</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dobrý deň ${firstName} ${lastName},</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Váš účet pre spoločnosť <strong>${companyName}</strong> bol úspešne vytvorený v našom merchant portáli.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Prihlasovácie údaje:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            ${temporaryPassword ? `<p style="margin: 5px 0;"><strong>Dočasné heslo:</strong> ${temporaryPassword}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'supabase.co')}/auth/v1/verify?type=magiclink&token_hash=placeholder&redirect_to=${encodeURIComponent(window?.location?.origin || 'https://app.utopia.sk')}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Prihlásiť sa do portálu
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <h3 style="color: #333;">Čo môžete v portáli robiť:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Sledovať stav vašich zmlúv</li>
            <li>Spravovať prevádzkové miesta</li>
            <li>Kontrolovať mesačné zisky</li>
            <li>Komunikovať s naším tímom</li>
          </ul>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            V prípade otázok nás neváhajte kontaktovať na <a href="mailto:support@utopia.sk">support@utopia.sk</a>
          </p>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            Utopia Payment Platform<br>
            Vaša platobná infraštruktúra
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Utopia Platform <no-reply@utopia.sk>",
      to: [email],
      subject: `Vitajte v Utopia Platform - ${companyName}`,
      html: emailHtml,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);