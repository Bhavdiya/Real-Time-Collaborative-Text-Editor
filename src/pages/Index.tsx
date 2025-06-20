
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Edit, Users, Globe, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Real-Time
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Collaborative
            </span>
            <br />Text Editor
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Edit documents together in real-time with advanced conflict resolution,
            version control, and seamless collaboration features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/editor')} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              <Edit className="mr-2 h-5 w-5" />
              Start Collaborating
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 text-lg border-2"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600">Everything you need for seamless collaboration</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real-Time Collaboration</h3>
            <p className="text-gray-600 text-sm">Multiple users can edit simultaneously with live cursor tracking</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Conflict Resolution</h3>
            <p className="text-gray-600 text-sm">Advanced operational transformation handles simultaneous edits</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">WebSocket Connection</h3>
            <p className="text-gray-600 text-sm">Low-latency real-time communication with auto-reconnection</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Edit className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Version Control</h3>
            <p className="text-gray-600 text-sm">Track document versions and maintain editing history</p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Collaborating?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of teams already using our collaborative editor</p>
          <Button 
            onClick={() => navigate('/editor')}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
