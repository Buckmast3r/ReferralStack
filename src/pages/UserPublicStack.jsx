import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { Eye, Layers3, Sparkles, ExternalLink } from "lucide-react";

export default function UserPublicStack() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [isPro, setIsPro] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true); // Optional: if you add a loading state
      // setError(null); // Optional: if you add an error state
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            referrals (*),
            subscriptions (status, plan_name)
          `)
          .eq("username", username)
          .single();

        if (profileError) {
          console.error("Error fetching profile and subscriptions:", profileError);
          // Handle error appropriately, e.g., set an error state, redirect, or show message
          // setProfile(null); 
          // setLoading(false);
          return;
        }

        if (profileData) {
          setProfile(profileData);
          setReferrals(profileData.referrals || []);
          
          // Determine if user is "Pro"
          // A user might have multiple subscription records (e.g., old, canceled ones)
          // So, find if there's any current 'active' or 'trialing' subscription.
          const activeSubscription = profileData.subscriptions?.find(
            sub => sub.status === 'active' || sub.status === 'trialing'
          );
          setIsPro(!!activeSubscription); 
          
          setShowAnalytics(profileData.show_analytics_public || false);
        } else {
          // Handle case where profileData is null (e.g., username not found)
          // setProfile(null);
        }
      } catch (err) {
        console.error("Unexpected error in fetchData:", err);
        // setError("Failed to load stack data.");
        // setProfile(null);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (!profile) return <div className="text-center py-16">Loading stack...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-10 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <img
            src={profile.avatar_url || `/default-avatar.png`} // Ensure you have a default-avatar.png in your public folder or handle this differently
            alt={profile.username}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{profile.username}</h1>
            {profile.bio && <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 line-clamp-3">{profile.bio}</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Copy Stack Link
          </button>
          {/* Add other relevant links here if needed, e.g., social media */}
        </div>
      </div>

      {/* Analytics (Pro + toggle required) */}
      {isPro && showAnalytics && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Eye className="w-6 h-6" />} label="Total Clicks" value={referrals.reduce((sum, r) => sum + (r.clicks || 0), 0)} />
          <StatCard icon={<Layers3 className="w-6 h-6" />} label="Total Cards" value={referrals.length} />
          <StatCard icon={<Sparkles className="w-6 h-6" />} label="Top Performing Card" value={referrals[0]?.title || "-"} />
        </div>
      )}

      {/* Featured Card - Conditionally render only if referrals exist */}
      {referrals.length > 0 && (
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-slate-800 shadow-xl p-6 rounded-xl border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400"/> Featured Card
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{referrals[0].title}</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{referrals[0].description}</p>
            <a
              href={referrals[0].url} // Assuming 'url' is the direct referral link on the card object
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
            >
              Use Referral <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Referral Card Grid */}
      <h2 className="max-w-5xl mx-auto text-2xl font-semibold text-slate-800 dark:text-white mb-6">More Referral Cards</h2>
      {referrals.length > (referrals[0] ? 1:0) ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {referrals.slice(referrals[0] ? 1:0, isPro ? referrals.length : 5).map((card) => (
            <div key={card.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1.5">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">{card.description}</p>
              </div>
              <a
                href={card.url} // Assuming 'url' is the direct referral link on the card object
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group"
              >
                Use Referral <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </a>
            </div>
          ))}
          {!isPro && referrals.length > 5 && (
            <div className="bg-slate-100 dark:bg-slate-700/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 min-h-[200px]">
              <Sparkles size={32} className="mb-3"/>
              <div className="text-lg font-bold mb-1">Unlock More Cards</div>
              <p className="text-sm mb-4">Upgrade to Pro to showcase your entire stack!</p>
              <a href="/pricing" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors">
                View Pro Plans
              </a>
            </div>
          )}
        </div>
      ) : (
        referrals.length === 0 && (
          <p className="max-w-5xl mx-auto text-center text-slate-500 dark:text-slate-400 py-10">This user hasn't added any referral cards yet.</p>
        )
      )}

      {/* Build Your Own Stack CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 py-16 text-center rounded-xl shadow-2xl mt-16 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-3">Want Your Own Stack?</h3>
        <p className="text-blue-100 dark:text-blue-200 mb-8 max-w-xl mx-auto">Create a personalized page to share all your referral links just like this one with RefStack.me.</p>
        <a
          href="https://www.refstack.me" // Should ideally be your landing page route if different
          className="bg-white text-blue-600 px-8 py-3.5 rounded-lg hover:bg-blue-50 text-md font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          Get Started for Free
        </a>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
      <div className="mb-2 text-blue-600 dark:text-blue-400 inline-block p-3 bg-blue-100 dark:bg-blue-500/20 rounded-full">
        {React.cloneElement(icon, { strokeWidth: 2 })}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
} 