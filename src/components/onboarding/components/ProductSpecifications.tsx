
import { Badge } from "@/components/ui/badge";

interface ProductSpecificationsProps {
  product: any;
}

const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  if (!product?.specifications || product.specifications.length === 0) {
    return null;
  }

  const getDeviceType = (category: string) => {
    switch (category) {
      case 'terminals':
        return 'Mobilný terminál';
      case 'pos':
        return 'POS systém';
      case 'tablets':
        return 'Tablet';
      default:
        return 'Zariadenie';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-slate-900 mb-2">Typ zariadenia</h4>
        <Badge variant="secondary" className="text-sm">
          {getDeviceType(product.category)}
        </Badge>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-3">Špecifikácie</h4>
        <div className="space-y-2">
          {product.specifications.map((spec: string, index: number) => (
            <div key={index} className="flex items-start text-sm text-slate-700">
              <span className="text-blue-500 mr-3 mt-1 flex-shrink-0">•</span>
              <span>{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;
