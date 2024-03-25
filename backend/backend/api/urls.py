from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("register/", UserRegistrationView.as_view()),
    path("products/", ProductView.as_view(), name="products-view"),
    path("product/<int:pk>", ProductViewPK.as_view()),
    path("categories/", CategoryView.as_view()),
    path("category/<int:pk>", CategoryViewPK.as_view()),
    path("reviews/", ReviewView.as_view()),
    # path("review/<int:pk>", ReviewViewPK.as_view()),
    path("add-review/", AddReviewView.as_view()),
    path("cart/", CartView.as_view()),
    path("add-cart/", AddCartView.as_view()),
    path("delete-cart/", DeleteCartView.as_view()),
    path("stars/<int:pk>", stars_view),
    path("change-password/", ChangePasswordView.as_view()),
    path("edit-profile/", EditProfileView.as_view()),
    path("add-product/", AddProductView.as_view()),
    path("delete-product/<int:pk>", DeleteProductView.as_view()),
    path("edit-product/<int:pk>", EditProductView.as_view()),
    path("locked/<int:pk>", LockedProfileView.as_view()),
    path("accounts/", AccountsView.as_view()),
    path("info/", CurrentUserInfoView.as_view()),
    path("edit-category/<int:pk>", EditCategoryView.as_view()),
    path("add-category/", AddCategoryView.as_view()),
    path("my-reviews/", my_review_view),
    path("paid/", my_paid_view),
    path("add-paid/", AddPaidView.as_view()),
    path("payments/verify", VerifyPayment.as_view(), name="verify_payment"),
]
