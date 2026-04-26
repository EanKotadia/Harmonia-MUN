          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-bg font-bold">
                {profile?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">{profile?.email?.split('@')[0]}</p>
                <p className="text-[8px] text-accent font-bold uppercase tracking-widest">Administrator</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                onBack();
              }}
              className="p-3 bg-white/5 hover:bg-danger/10 text-muted hover:text-danger rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
