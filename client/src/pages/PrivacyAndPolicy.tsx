import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import DesignCard from "@/components/DesignCard";

export default function PrivacyAndPolicy() {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const { data: artists = [] } = useQuery({
    queryKey: ["/api/artists"],
  });

  console.log(artists);

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ["/api/designs", selectedArtist],
    queryFn: async () => {
      const url = selectedArtist && selectedArtist !== "all"
        ? `/api/designs?artist=${selectedArtist}`
        : "/api/designs";
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch design');
      return response.json();
    },
  });

  console.log(designs);

  const filteredDesigns = designs
    .filter((design: any) => 
      design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    
   
    <div className="container mx-auto px-4 py-8">

      {/* Content Grid */}

      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Política de Privacidad
      </h1>

      <p className="text-lg text-gray-600 mb-4">
        Fecha de entrada en vigor: 11 de julio de 2025
      </p>

      <p className="text-lg text-gray-600 mb-4">
        En <strong>Creazionilaser</strong>, nos comprometemos a proteger la privacidad de nuestros clientes. Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio web <strong>www.creazionilaser.com</strong> o realizas una compra con nosotros.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        1. Información que Recopilamos
      </h2>
      <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
        <li><strong>Datos personales:</strong> nombre, dirección, correo electrónico, número de teléfono.</li>
        <li><strong>Datos de pago:</strong> información de tarjetas o cuentas de pago (procesada por plataformas seguras de terceros).</li>
        <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas y cookies.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        2. Uso de la Información
      </h2>
      <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
        <li>Procesar y entregar pedidos.</li>
        <li>Enviar confirmaciones de compra y actualizaciones del estado del pedido.</li>
        <li>Responder a consultas o solicitudes del cliente.</li>
        <li>Enviar promociones o noticias (solo si aceptas recibirlas).</li>
        <li>Mejorar nuestro sitio web y la experiencia de usuario.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        3. Cookies
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Usamos cookies para facilitar la navegación, recordar preferencias y analizar el comportamiento de los usuarios. Puedes configurar tu navegador para rechazar las cookies, aunque esto puede afectar algunas funcionalidades del sitio.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        4. Compartir Información
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Tu información personal no será vendida ni compartida con terceros, salvo en los siguientes casos:
      </p>
      <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
        <li>Proveedores de servicios (envíos, plataformas de pago, atención al cliente).</li>
        <li>Obligaciones legales o requerimientos por autoridades.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        5. Seguridad
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger tu información contra accesos no autorizados, pérdidas o alteraciones.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        6. Derechos del Usuario
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        De acuerdo con la legislación vigente, tienes derecho a:
      </p>
      <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
        <li>Acceder a tus datos personales.</li>
        <li>Solicitar correcciones o actualizaciones.</li>
        <li>Solicitar la eliminación de tus datos, salvo cuando debamos conservarlos por motivos legales o contractuales.</li>
        <li>Revocar el consentimiento para el uso de tus datos.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        7. Enlaces a Terceros
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Este sitio puede contener enlaces a otros sitios web. No somos responsables de sus políticas de privacidad ni de sus prácticas.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        8. Cambios a esta Política
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Podemos actualizar esta política ocasionalmente. Te notificaremos cualquier cambio publicándolo en esta página, con una nueva fecha de vigencia.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
        9. Contacto
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Para consultas relacionadas con esta Política de Privacidad, contáctanos a:
      </p>
      <p className="text-lg text-gray-600">
        <strong>Correo electrónico:</strong> privacidad@creazionilaser.com<br />
        <strong>Teléfono:</strong> +52-XXX-XXX-XXXX<br />
        <strong>Dirección:</strong> [Dirección de Creazionilaser], México
      </p>
    </div>
  );
}
