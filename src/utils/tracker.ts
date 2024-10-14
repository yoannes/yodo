import mixpanel from "mixpanel-browser";

if (!import.meta.env.DEV) {
}
mixpanel.init(import.meta.env.VITE_MIXPANEL, {
  debug: import.meta.env.DEV,
  track_pageview: true,
  persistence: "localStorage",
});

export function identifyUser(userId: string) {
  mixpanel.identify(userId);
}

export function setUser(name: string, email: string) {
  mixpanel.people.set({
    $name: name,
    $email: email,
    plan: "Free",
  });
}

export function track(eventName: string, data: Record<string, any>) {
  mixpanel.track(eventName, data);
}
