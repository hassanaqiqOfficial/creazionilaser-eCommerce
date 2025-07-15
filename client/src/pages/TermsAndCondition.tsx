import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import DesignCard from "@/components/DesignCard";

export default function TermsAndCondition() {

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
    
    <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8 py-8">
      
      {/* Content Grid */}
      
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Términos y Condiciones
          </h1>

          <p className="text-lg text-gray-600 mb-4">
            Fecha de entrada en vigor: 11 de julio de 2025
          </p>

          <p className="text-lg text-gray-600 mb-4">
            Bienvenido a <strong>Creazionilaser</strong>. Al acceder y utilizar nuestro sitio web <strong>www.creazionilaser.com</strong>, aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente antes de realizar una compra.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            1. Información General
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Creazionilaser es una tienda en línea especializada en productos personalizados mediante corte y grabado láser. Todos los servicios y productos ofrecidos están sujetos a disponibilidad.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            2. Uso del Sitio
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
            <li>El usuario se compromete a utilizar este sitio de manera legal y respetuosa.</li>
            <li>Está prohibido el uso del sitio para actividades fraudulentas o no autorizadas.</li>
            <li>Nos reservamos el derecho de suspender cuentas que infrinjan estos términos.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            3. Precios y Pagos
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
            <li>Todos los precios están en pesos mexicanos (MXN) e incluyen IVA, salvo que se indique lo contrario.</li>
            <li>Los métodos de pago aceptados se muestran durante el proceso de compra.</li>
            <li>Creazionilaser se reserva el derecho de modificar los precios sin previo aviso.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            4. Envíos
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
            <li>Los envíos se realizan a la dirección proporcionada por el cliente.</li>
            <li>Los plazos de entrega pueden variar según ubicación y demanda.</li>
            <li>No nos responsabilizamos por retrasos causados por terceros.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            5. Devoluciones y Cancelaciones
          </h2>
          <ul className="list-disc pl-6 text-lg text-gray-600 mb-4">
            <li>Los productos personalizados no tienen devolución, salvo defecto de fabricación.</li>
            <li>En caso de error por parte de Creazionilaser, se realizará una reposición sin costo adicional.</li>
            <li>Las cancelaciones solo serán aceptadas si el pedido aún no ha sido procesado.</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            6. Propiedad Intelectual
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Todo el contenido del sitio (imágenes, diseños, logotipos, textos) es propiedad de Creazionilaser y está protegido por leyes de derechos de autor. Está prohibida su reproducción sin autorización previa por escrito.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            7. Protección de Datos
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            La información personal proporcionada será tratada conforme a nuestra{" "}
            <a href="/politica-de-privacidad" className="text-blue-600 underline">
              Política de Privacidad
            </a>.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            8. Modificaciones
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Creazionilaser se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el sitio web.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            9. Legislación Aplicable
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta ante los tribunales competentes del país.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10">
            10. Contacto
          </h2>
          <p className="text-lg text-gray-600">
            <strong>Email:</strong> contacto@creazionilaser.com<br />
            <strong>Teléfono:</strong> +52-XXX-XXX-XXXX<br />
            <strong>Dirección:</strong> [Dirección de Creazionilaser], México
          </p>
        </div>

    </div>
  );
}
