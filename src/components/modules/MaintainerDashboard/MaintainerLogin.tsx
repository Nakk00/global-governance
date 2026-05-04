import { type CSSProperties, type FormEvent, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import "@fontsource/cinzel/latin-600.css"
import "@fontsource/cormorant-garamond/latin-600.css"
import "@fontsource/inter/latin-400.css"
import "@fontsource/inter/latin-500.css"
import "@fontsource/inter/latin-600.css"
import "@fontsource/inter/latin-700.css"
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react"

import globeIcon from "@/assets/maintainer-login/Globe-Icon.png"
import loginBackground from "@/assets/maintainer-login/LoginUI_BG.png"
import { signInWithPassword } from "@/lib/supabase/browser-client"

const revealEase = [0.16, 1, 0.3, 1] as const

export function MaintainerLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorAnimationKey, setErrorAnimationKey] = useState(0)
  const [interactive, setInteractive] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const reveal = (step: number) =>
    shouldReduceMotion
      ? {
          initial: { opacity: 0.001 },
          animate: { opacity: 1 },
          transition: { duration: 0.18, delay: step * 0.02 },
        }
      : {
          initial: { opacity: 0.001, y: 18, filter: "blur(10px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            duration: 0.72,
            delay: 0.28 + step * 0.12,
            ease: revealEase,
          },
        }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signInWithPassword({ email, password })
      onSignedIn()
    } catch {
      setError("The maintainer sign-in request could not be completed.")
      setErrorAnimationKey((current) => current + 1)
      if (!shouldReduceMotion) {
        setShaking(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      className="maintainer-login-page"
      data-interactive={interactive || submitting ? "true" : "false"}
      style={
        {
          "--maintainer-login-bg": `url(${loginBackground})`,
        } as CSSProperties
      }
    >
      <motion.div
        className="maintainer-login-orbits"
        aria-hidden="true"
        initial={
          shouldReduceMotion
            ? { opacity: 0.001 }
            : { opacity: 0.001, scale: 0.94 }
        }
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 1.1,
          ease: revealEase,
        }}
      >
        <span className="maintainer-login-orbit maintainer-login-orbit-one" />
        <span className="maintainer-login-orbit maintainer-login-orbit-two" />
        <span className="maintainer-login-orbit maintainer-login-orbit-three" />
      </motion.div>

      <motion.section
        className="maintainer-login-card"
        aria-labelledby="login-title"
        data-loading={submitting ? "true" : "false"}
        onPointerEnter={() => setInteractive(true)}
        onPointerLeave={() => setInteractive(false)}
        onFocusCapture={() => setInteractive(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setInteractive(false)
          }
        }}
        initial={
          shouldReduceMotion ? { opacity: 0.001 } : { opacity: 0.001, y: 20 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: submitting ? -3 : 0,
                scale: submitting ? 0.985 : 1,
                x: shaking ? [0, -8, 7, -5, 3, 0] : 0,
              }
        }
        transition={
          shaking
            ? { duration: 0.42, ease: "easeInOut" }
            : { duration: 0.72, delay: 0.18, ease: revealEase }
        }
        onAnimationComplete={() => {
          if (shaking) {
            setShaking(false)
          }
        }}
      >
        <motion.div
          className="maintainer-login-brand"
          aria-label="Global Governance"
          {...reveal(1)}
        >
          <span className="maintainer-login-logo-shell" aria-hidden="true">
            <img src={globeIcon} alt="" className="maintainer-login-logo" />
          </span>
          <p className="maintainer-login-brand-title">Global Governance</p>
          <p className="maintainer-login-brand-subtitle">
            Education for a connected world
          </p>
        </motion.div>

        <motion.div
          className="maintainer-login-divider"
          aria-hidden="true"
          {...reveal(2)}
        >
          <span />
        </motion.div>

        <motion.div className="maintainer-login-copy" {...reveal(3)}>
          <h1 id="login-title" className="maintainer-login-heading">
            Maintainer Sign In
          </h1>
          <p className="maintainer-login-subtitle">
            Private access for approved-source stewardship and admin operations
          </p>
        </motion.div>

        <form className="maintainer-login-form" onSubmit={submit}>
          <motion.label className="maintainer-login-field" {...reveal(4)}>
            <span className="maintainer-login-field-label">Email</span>
            <span className="maintainer-login-input-shell">
              <span
                className="maintainer-login-input-glow"
                aria-hidden="true"
              />
              <span
                className="maintainer-login-input-sweep"
                aria-hidden="true"
              />
              <Mail
                className="maintainer-login-input-icon"
                aria-hidden="true"
              />
              <input
                className="maintainer-login-input"
                type="email"
                autoComplete="email"
                placeholder="name@organization.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "maintainer-login-error" : undefined}
                required
              />
            </span>
          </motion.label>

          <motion.label className="maintainer-login-field" {...reveal(5)}>
            <span className="maintainer-login-field-label">Password</span>
            <span className="maintainer-login-input-shell">
              <span
                className="maintainer-login-input-glow"
                aria-hidden="true"
              />
              <span
                className="maintainer-login-input-sweep"
                aria-hidden="true"
              />
              <LockKeyhole
                className="maintainer-login-input-icon"
                aria-hidden="true"
              />
              <input
                className="maintainer-login-input maintainer-login-input-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "maintainer-login-error" : undefined}
                required
              />
              <button
                type="button"
                className="maintainer-login-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </button>
            </span>
          </motion.label>

          <motion.p
            className="maintainer-login-forgot"
            aria-disabled="true"
            {...reveal(6)}
          >
            Forgot password?
          </motion.p>

          <AnimatePresence initial={false}>
            {error ? (
              <motion.p
                key={errorAnimationKey}
                id="maintainer-login-error"
                className="maintainer-login-error"
                role="alert"
                aria-live="polite"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0.001 }
                    : { opacity: 0.001, y: -6 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0.001 }
                    : { opacity: 0.001, y: -4 }
                }
                transition={{ duration: 0.18 }}
              >
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>

          <motion.button
            className="maintainer-login-submit"
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            whileHover={
              shouldReduceMotion || submitting ? undefined : { y: -2 }
            }
            whileTap={
              shouldReduceMotion || submitting
                ? undefined
                : { y: 1, scale: 0.99 }
            }
            {...reveal(7)}
          >
            <span
              className="maintainer-login-submit-sweep"
              aria-hidden="true"
            />
            <motion.span
              className="maintainer-login-submit-symbol"
              aria-hidden="true"
              animate={
                shouldReduceMotion || submitting
                  ? { scale: 1 }
                  : { scale: [1, 1.08, 1] }
              }
              transition={{
                duration: 2.4,
                repeat: shouldReduceMotion || submitting ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              {submitting ? (
                <Loader2 className="maintainer-login-submit-spinner" />
              ) : (
                <ShieldCheck
                  className="maintainer-login-submit-icon"
                  strokeWidth={2.2}
                />
              )}
            </motion.span>
            <span>{submitting ? "Signing in" : "Sign In"}</span>
          </motion.button>
        </form>

        <motion.div className="maintainer-login-footer" {...reveal(8)}>
          <span className="maintainer-login-footer-rule" aria-hidden="true" />
          <Lock className="maintainer-login-footer-lock" aria-hidden="true" />
          <p>Authorized maintainers only</p>
        </motion.div>
      </motion.section>
    </main>
  )
}
