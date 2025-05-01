import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cartAtom,
  clearCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
} from "@/lib/atoms/cart";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ru from "react-phone-number-input/locale/ru.json";
import { z } from "zod";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";

export const Route = createFileRoute("/cart")({
  component: RouteComponent,
});

// Define enum for delivery methods
const DeliveryMethod = {
  STORE_CITY: "store-city",
  STORE_CONTINENT: "store-continent",
  STORE_TEXTILE: "store-textile",
  STORE_DONETSK: "store-donetsk",
  STORE_MAKEEVKA: "store-makeevka",
  STORE_GORLOVKA: "store-gorlovka",
  STORE_ENAKIEVO: "store-enakievo",
  STORE_SNEZHNOE: "store-snezhnoe",
  COURIER_DONETSK: "courier-donetsk",
  COURIER_MAKEEVKA: "courier-makeevka",
  COURIER_OTHER: "courier-other",
  COURIER_CENTRAL: "courier-central",
} as const;

const PaymentMethod = {
  ON_DELIVERY: "payment-delivery",
  ONLINE: "payment-online",
} as const;

const FormSchema = z.object({
  name: z.string().trim().min(3, { message: "Имя обязательно к заполнению!" }),
  email: z
    .string()
    .min(1, { message: "E-mail обязателен к заполнению!" })
    .email("Неверный формат E-mail"),
  phoneNumber: z
    .string({ required_error: "Телефон обязателен к заполнению!" })
    .refine(isPossiblePhoneNumber, "Проверьте правильность ввода телефона!"),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: "Выберите способ оплаты",
  }),
  deliveryMethod: z.nativeEnum(DeliveryMethod, {
    required_error: "Выберите способ доставки",
  }),
});

type DefaultValues = z.infer<typeof FormSchema>;

const defaultValues: DefaultValues = {
  name: "",
  email: "",
  phoneNumber: "",
  paymentMethod: PaymentMethod.ON_DELIVERY,
  deliveryMethod: DeliveryMethod.STORE_CITY,
};

// Add this function to load the script externally
const loadCloudPaymentsScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudpayments.ru/bundles/cloudpayments.js";
    script.async = true;
    script.id = "cloudpayments-script";
    script.onload = () => resolve({});
    script.onerror = () =>
      reject(new Error("Failed to load CloudPayments script"));
    document.body.appendChild(script);
  });
};

const removeCloudPaymentsScript = () => {
  const script = document.getElementById("cloudpayments-script");
  if (script) {
    script.parentNode?.removeChild(script);
  }
};

function RouteComponent() {
  // Then in your component:
  useEffect(() => {
    loadCloudPaymentsScript()
      .then(() => console.log("CloudPayments script loaded"))
      .catch((error) => console.error(error));

    return () => {
      removeCloudPaymentsScript();
    };
  }, []);

  const [cart] = useAtom(cartAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [, updateQuantity] = useAtom(updateQuantityAtom);
  const [, clearCart] = useAtom(clearCartAtom);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const formState = form.formState;
  const values = form.getValues();
  const isSubmitting = formState.isSubmitting;
  console.log({
    errors: formState.errors,
    dirtyFields: formState.dirtyFields,
    formState,
    values,
  });

  const onSubmit: SubmitHandler<DefaultValues> = async (data) => {
    if (data.paymentMethod === PaymentMethod.ONLINE) {
      // Make sure the script is loaded before using it
      if (!(window as any).cp || !(window as any).cp.CloudPayments) {
        await loadCloudPaymentsScript();
      }

      const widget = new (window as any).cp.CloudPayments();

      try {
        const result = await widget.pay("charge", {
          publicId: "test_api_00000000000000000000002", // Публичный ID из CloudPayments личного кабинета
          description: "Оплата заказа в магазине",
          amount: cart.total, // Сумма оплаты
          currency: "RUB", // Валюта
          accountId: data.email, // Идентификатор плательщика (можно телефон или email)
          email: data.email,
          skin: "classic", // Внешний вид формы
          data: {
            name: data.name,
            phoneNumber: data.phoneNumber,
            paymentMethod: data.paymentMethod,
            deliveryMethod: data.deliveryMethod,
          },
        });

        if (result.success) {
          console.log("Оплата прошла успешно!");
          clearCart();
          // Здесь можно отправить заказ в базу данных или показать успешную страницу
        } else {
          console.log("Оплата отменена");
        }
      } catch (error) {
        console.error("Ошибка оплаты:", error);
      }
    } else {
      console.log("Выбрана оплата при получении");
      // Здесь можно сразу отправить заказ без оплаты
    }
  };

  // Mapping between delivery method ids and display labels
  const deliveryMethodLabels = {
    [DeliveryMethod.STORE_CITY]: "Магазин Сити",
    [DeliveryMethod.STORE_CONTINENT]: "Магазин Континент",
    [DeliveryMethod.STORE_TEXTILE]: "Магазин Текстильщик",
    [DeliveryMethod.STORE_DONETSK]: "Магазин Донской",
    [DeliveryMethod.STORE_MAKEEVKA]: "Магазин Макеевка",
    [DeliveryMethod.STORE_GORLOVKA]: "Магазин Горловка",
    [DeliveryMethod.STORE_ENAKIEVO]: "Магазин Енакиево",
    [DeliveryMethod.STORE_SNEZHNOE]: "Магазин Снежное",
    [DeliveryMethod.COURIER_DONETSK]: "Курьерская доставка (Донецк)",
    [DeliveryMethod.COURIER_MAKEEVKA]: "Курьерская доставка (Макеевка)",
    [DeliveryMethod.COURIER_OTHER]: "Курьерская доставка (Другой город)",
    [DeliveryMethod.COURIER_CENTRAL]: "Курьерская доставка (Центральный склад)",
  };

  // Mapping between payment method ids and display labels
  const paymentMethodLabels = {
    [PaymentMethod.ON_DELIVERY]: "Оплата при получении",
    [PaymentMethod.ONLINE]: "Онлайн оплата",
  };

  return (
    <div className="flex-1 mt-2 container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Оформление заказа</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Имя пользователя</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Имя пользователя"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E-mail"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <PhoneInput
                              id="phone"
                              placeholder="Введите номер телефона"
                              countries={["RU"]}
                              international
                              labels={ru}
                              countryCallingCodeEditable={false}
                              defaultCountry={"RU"}
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Выберите способ оплаты</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-2"
                        >
                          {Object.entries(paymentMethodLabels).map(
                            ([value, label]) => (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={value}
                                  id={`payment-${value}`}
                                />
                                <Label htmlFor={`payment-${value}`}>
                                  {label}
                                </Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Delivery Method */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium">
                  Выберите способ доставки
                </h2>
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2"
                        >
                          {Object.entries(deliveryMethodLabels).map(
                            ([value, label]) => (
                              <div
                                key={value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={value} id={value} />
                                <Label htmlFor={value}>{label}</Label>
                              </div>
                            ),
                          )}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <div className="text-sm">
                <p>
                  Подтверждая заказ, Вы соглашаетесь с{" "}
                  <Link
                    hash="#"
                    to="."
                    className="text-orange-500 hover:underline"
                  >
                    Политикой конфиденциальности
                  </Link>
                  ,{" "}
                  <Link
                    hash="#"
                    to="."
                    className="text-orange-500 hover:underline"
                  >
                    Правилами пользования сайтом
                  </Link>{" "}
                  и{" "}
                  <Link
                    to="."
                    hash="#"
                    className="text-orange-500 hover:underline"
                  >
                    Правилами продажи товаров
                  </Link>
                  .
                </p>
              </div>

              <Button
                disabled={isSubmitting}
                className="bg-orange-500 dark:text-foreground hover:bg-orange-600"
              >
                {!isSubmitting ? (
                  "Оформить заказ"
                ) : (
                  <>
                    <Loader2 className="animate-spin" />
                    Обрабатывается
                  </>
                )}
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-lg border p-6">
                <h2 className="text-xl font-medium mb-4">
                  Итого к оплате: {cart.total.toLocaleString()} ₽
                </h2>

                {cart.items.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Ваша корзина пуста</p>
                    <Button asChild type="button" variant="outline">
                      <Link to="/">Перейти к покупкам</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="border-t pt-4 space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-start space-x-4"
                      >
                        <button
                          type="button"
                          className="text-red-500 mt-1"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>

                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.product.images.find((img) => img.isPrimary)
                                ?.url || item.product.images[0].url
                            }
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                        </div>

                        <div className="flex-1">
                          <Link
                            to={"/product/$slug"}
                            params={{ slug: item.product.slug }}
                          >
                            <h3 className="font-medium hover:text-orange-500 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center mt-2">
                            <button
                              type="button"
                              className="border rounded-md p-1"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              type="button"
                              className="border rounded-md p-1"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold">
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}{" "}
                            ₽
                          </span>
                          {item.product.oldPrice && (
                            <div className="text-gray-400 line-through text-sm">
                              {(
                                item.product.oldPrice * item.quantity
                              ).toLocaleString()}{" "}
                              ₽
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {cart.discount > 0 && (
                      <div className="flex justify-between pt-4 border-t">
                        <span>Скидка:</span>
                        <span className="text-green-600">
                          -{cart.discount.toLocaleString()} ₽
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t font-bold">
                      <span>Итого:</span>
                      <span>{cart.total.toLocaleString()} ₽</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
