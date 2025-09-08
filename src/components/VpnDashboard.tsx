import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Globe, 
  Zap, 
  Settings, 
  User,
  MapPin,
  Clock,
  Loader2
} from "lucide-react";
import vpnHero from "@/assets/vpn-hero.jpg";

type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface VpnServer {
  id: string;
  name: string;
  country: string;
  flag: string;
  latency: number;
}

const servers: VpnServer[] = [
  { id: "us-east", name: "New York", country: "United States", flag: "🇺🇸", latency: 25 },
  { id: "us-west", name: "Los Angeles", country: "United States", flag: "🇺🇸", latency: 45 },
  { id: "uk", name: "London", country: "United Kingdom", flag: "🇬🇧", latency: 35 },
  { id: "germany", name: "Frankfurt", country: "Germany", flag: "🇩🇪", latency: 30 },
  { id: "canada", name: "Toronto", country: "Canada", flag: "🇨🇦", latency: 40 },
  { id: "netherlands", name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", latency: 28 },
];

export const VpnDashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [ipv4, setIpv4] = useState<string>("");
  const [ipv6, setIpv6] = useState<string>("");
  const [protectedIpv4, setProtectedIpv4] = useState("");
  const [protectedIpv6, setProtectedIpv6] = useState("");
  const [connectionTime, setConnectionTime] = useState(0);
  const [loadingIp, setLoadingIp] = useState(true);

  const fetchRealIp = async () => {
    setLoadingIp(true);
    try {
      // Fetch IPv4
      const ipv4Response = await fetch('https://api.ipify.org?format=json');
      const ipv4Data = await ipv4Response.json();
      setIpv4(ipv4Data.ip);

      // Fetch IPv6 
      try {
        const ipv6Response = await fetch('https://api64.ipify.org?format=json');
        const ipv6Data = await ipv6Response.json();
        setIpv6(ipv6Data.ip);
      } catch {
        setIpv6("Not available");
      }
    } catch (error) {
      setIpv4("Unable to fetch");
      setIpv6("Unable to fetch");
    }
    setLoadingIp(false);
  };

  useEffect(() => {
    fetchRealIp();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionStatus === "connected") {
      interval = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleConnection = () => {
    if (connectionStatus === "disconnected") {
      setConnectionStatus("connecting");
      setTimeout(() => {
        setConnectionStatus("connected");
        setProtectedIpv4(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
        setProtectedIpv6(`2001:${Math.floor(Math.random() * 9999).toString(16)}:${Math.floor(Math.random() * 9999).toString(16)}::${Math.floor(Math.random() * 9999).toString(16)}`);
        setConnectionTime(0);
      }, 2000);
    } else {
      setConnectionStatus("disconnected");
      setProtectedIpv4("");
      setProtectedIpv6("");
      setConnectionTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "vpn-connected";
      case "connecting": return "vpn-connecting";
      default: return "vpn-disconnected";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected": return <ShieldCheck className="w-8 h-8" />;
      case "connecting": return <Loader2 className="w-8 h-8 animate-connecting" />;
      default: return <ShieldX className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SecureVPN
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Connection Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-glass backdrop-blur-sm border-white/10 shadow-glass">
              <CardContent className="p-8 text-center">
                <div className="relative mb-8">
                  <img 
                    src={vpnHero} 
                    alt="VPN Security" 
                    className="w-full h-48 object-cover rounded-lg opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-6 rounded-full bg-${getStatusColor()}/20 border-2 border-${getStatusColor()}`}>
                      <div className="text-white">
                        {getStatusIcon()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Badge 
                    className={`px-4 py-2 text-sm font-medium bg-${getStatusColor()}/20 text-${getStatusColor()} border-${getStatusColor()}/30`}
                  >
                    {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                  </Badge>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {connectionStatus === "connected" ? "Protected IPv4" : "Your IPv4"}
                      </p>
                      <p className="text-lg font-mono">
                        {loadingIp ? "Loading..." : connectionStatus === "connected" ? protectedIpv4 : ipv4}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {connectionStatus === "connected" ? "Protected IPv6" : "Your IPv6"}
                      </p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {loadingIp ? "Loading..." : connectionStatus === "connected" ? protectedIpv6 : ipv6}
                      </p>
                    </div>
                  </div>

                  {connectionStatus === "connected" && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Connected for {formatTime(connectionTime)}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleConnection}
                    variant={connectionStatus === "connected" ? "disconnect" : "connect"}
                    size="lg"
                    className="w-full py-4 text-xl"
                    disabled={connectionStatus === "connecting"}
                  >
                    {connectionStatus === "connecting" && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                    {connectionStatus === "connected" ? "Disconnect" : 
                     connectionStatus === "connecting" ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Server */}
            <Card className="bg-gradient-glass backdrop-blur-sm border-white/10 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Current Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedServer.flag}</span>
                    <div>
                      <p className="font-medium">{selectedServer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedServer.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Latency</p>
                    <p className="font-medium text-vpn-connected">{selectedServer.latency}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Server List */}
            <Card className="bg-gradient-glass backdrop-blur-sm border-white/10 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Servers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {servers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server)}
                    className={`w-full p-3 rounded-lg text-left transition-all hover:bg-white/10 ${
                      selectedServer.id === server.id ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{server.flag}</span>
                        <span className="text-sm">{server.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{server.latency}ms</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-gradient-glass backdrop-blur-sm border-white/10 shadow-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Kill Switch</p>
                    <p className="text-xs text-muted-foreground">Block internet if VPN disconnects</p>
                  </div>
                  <Switch 
                    checked={killSwitch} 
                    onCheckedChange={setKillSwitch}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Connect</p>
                    <p className="text-xs text-muted-foreground">Connect on startup</p>
                  </div>
                  <Switch 
                    checked={autoConnect} 
                    onCheckedChange={setAutoConnect}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Protocol Info */}
            <Card className="bg-gradient-glass backdrop-blur-sm border-white/10 shadow-glass">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 mx-auto text-vpn-connected" />
                  <p className="font-medium">WireGuard Protocol</p>
                  <p className="text-xs text-muted-foreground">Military-grade encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};