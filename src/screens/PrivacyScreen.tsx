import { Link } from "react-router-dom";

export function PrivacyScreen() {
  return (
    <div className="bg-base min-h-screen flex flex-col gap-4 p-6">
      <Link to="/login" className="text-xs text-ink-soft">
        ← voltar
      </Link>

      <h1 className="font-display font-semibold text-xl text-ink">Política de privacidade</h1>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Quem somos</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          O SplashTime é um app para nadadores registrarem e acompanharem seus tempos. O
          responsável pelo app é Diego Farias, contato pelo WhatsApp (11) 94794-5177.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Quem pode criar a conta</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          A conta deve ser criada e administrada por um adulto responsável, principalmente quando
          o atleta for menor de idade.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Quais dados guardamos</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          E-mail e senha de acesso (a senha é guardada de forma protegida), nome, idade, altura,
          peso, equipe, foto de perfil (opcional) e os tempos de nado registrados.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Para que usamos</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          Somente para o app funcionar: mostrar seus tempos, recordes e gráficos. Não vendemos
          nem compartilhamos esses dados com terceiros para publicidade.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Onde ficam</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          Em servidores de um serviço de banco de dados contratado por nós, com acesso protegido
          por login.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Seus direitos</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          Você pode pedir a correção ou a exclusão da conta e de todos os dados a qualquer
          momento, pelo WhatsApp informado acima.
        </p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-ink">Pagamento</h2>
        <p className="text-xs text-ink-soft leading-relaxed">
          O pagamento é feito por Pix, fora do app. Não guardamos dados de cartão nem de conta
          bancária.
        </p>
      </section>
    </div>
  );
}