"use client";

import { Suspense, useState, useEffect } from "react";
import Header from "@/app/shared/componets/layout/Header/Header";
import Footer from "@/app/shared/componets/layout/Footer/Footer";
import { useUserStore, AuthModal } from "@/app/features/user";
import { CheckoutBillingModal } from "./CheckoutBillingModal";
import { useAccountNav } from "./hooks/useAccountNav";
import { useProfile } from "./hooks/useProfile";
import { useOrdersTab } from "./hooks/useOrdersTab";
import { useCheckout } from "./hooks/useCheckout";
import AccountSidebar from "./components/AccountSidebar/AccountSidebar";
import AuthGate from "./components/AuthGate/AuthGate";
import ProfileTab from "./components/ProfileTab/ProfileTab";
import CartTab from "./components/CartTab/CartTab";
import OrdersTab from "./components/OrdersTab/OrdersTab";
import PaymentTab from "./components/PaymentTab/PaymentTab";
import SupportTab from "./components/SupportTab/SupportTab";
import styles from "./account.module.scss";

function AccountPageContent() {
  const token = useUserStore((s) => s.token);
  const accountEmail = useUserStore((s) => s.email);
  const logout = useUserStore((s) => s.logout);

  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!token) setAuthOpen(true);
  }, [token]);

  const { tab, goTab } = useAccountNav();
  const profile = useProfile();
  const orders = useOrdersTab(tab === "orders");
  const checkout = useCheckout(() => goTab("orders", () => setAuthOpen(true)));

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.layout}>
          <AccountSidebar
            tab={tab}
            onTabChange={goTab}
            onAuthRequired={() => setAuthOpen(true)}
            onLogout={logout}
          />

          <div className={styles.content}>
            {!token && <AuthGate onLogin={() => setAuthOpen(true)} />}

            {token && tab === "profile" && <ProfileTab profile={profile} />}

            {token && tab === "cart" && (
              <CartTab
                onCheckout={checkout.openCheckoutModal}
                checkoutBusy={checkout.checkoutBusy}
                checkoutError={checkout.checkoutError}
                checkoutModalOpen={checkout.checkoutModalOpen}
              />
            )}

            {token && tab === "orders" && <OrdersTab orders={orders} />}

            {token && tab === "payment" && <PaymentTab />}

            {token && tab === "support" && <SupportTab />}
          </div>
        </div>
      </main>

      <CheckoutBillingModal
        isOpen={checkout.checkoutModalOpen}
        onClose={() => {
          if (checkout.checkoutBusy) return;
          checkout.setCheckoutModalOpen(false);
        }}
        defaultEmail={accountEmail}
        busy={checkout.checkoutBusy}
        error={checkout.checkoutError}
        onSubmit={(billing) => void checkout.submitCheckout(billing)}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <Header />
          <main className={styles.main}>
            <p className={styles.emptyText}>Загрузка…</p>
          </main>
          <Footer />
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
