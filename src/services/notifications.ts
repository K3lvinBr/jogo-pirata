export type VoyageNotice = { title: string; body: string; voyageId: string };

export interface NavigationNotificationAdapter {
  onVoyageStarted(notice: VoyageNotice): Promise<void> | void;
  onVoyageCompleted(notice: VoyageNotice): Promise<void> | void;
}

// Web adapter: visible logs now; replace with expo-notifications on native,
// plus a dedicated Android foreground-service / iOS Live Activity module.
export const webNotificationAdapter: NavigationNotificationAdapter = {
  onVoyageStarted: notice => console.info('[NAVEGAÇÃO]', notice.title, notice.body),
  onVoyageCompleted: notice => {
    console.info('[NAVEGAÇÃO CONCLUÍDA]', notice.title, notice.body);
    if (typeof globalThis !== 'undefined' && 'alert' in globalThis) {
      // Web-only MVP feedback. Native adapters must not use browser alerts.
      console.info('O navio chegou ao destino.');
    }
  }
};