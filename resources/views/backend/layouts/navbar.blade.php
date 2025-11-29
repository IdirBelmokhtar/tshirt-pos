<nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
        <li class="nav-item">
            <a id="pushmenu-btn" class="nav-link" data-widget="pushmenu" href="#" role="button"><i
                    class="fas fa-list"></i></a>
        </li>
        {{-- <li class="nav-item d-none d-sm-inline-block">
            <a href="index3.html" class="nav-link">Home</a>
        </li> --}}
        {{-- <li class="nav-item d-none d-sm-inline-block">
            <a href="#" class="nav-link">Contact</a>
        </li> --}}
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">

        @can('sale_create')
            <li class="nav-item dropdown">
                <a class="nav-link btn bg-gradient-primary text-white" href="{{ route('backend.admin.cart.index') }}">
                    <i class="fas fa-cart-plus"> POS</i>
                </a>
            </li>
        @endcan
        <!-- Notifications Dropdown Menu -->
        <!-- <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">15</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header">15 Notifications</span>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-envelope mr-2"></i> 4 new messages
                    <span class="float-right text-muted text-sm">3 mins</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-users mr-2"></i> 8 friend requests
                    <span class="float-right text-muted text-sm">12 hours</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-file mr-2"></i> 3 new reports
                    <span class="float-right text-muted text-sm">2 days</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
            </div>
        </li> -->
        <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                <i class="fas fa-expand-arrows-alt"></i>
            </a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="fas fa-user-circle"></i>
                <i class="fas fa-angle-double-down"></i>
            </a>
            <div class="dropdown-menu ">
                <a href="{{ route('backend.admin.profile') }}" class="dropdown-item dropdown-footer">
                    <i class="fas fa-address-card"></i>
                    Profile
                </a>
                <div class="dropdown-divider"></div>
                <a href="{{ route('logout') }}" class="dropdown-item dropdown-footer">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </a>
            </div>
        </li>
    </ul>
</nav>

@if (request()->is('admin/cart'))
    {{-- <style>
        /* Dark blurred background */
        #fs-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(4px);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.25s ease-out;
        }

        /* Center box */
        #fs-modal {
            background: #fff;
            padding: 35px 40px;
            width: 100%;
            max-width: 420px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0px 10px 35px rgba(0, 0, 0, 0.18);
            animation: scaleIn 0.25s ease-out;
        }

        /* Icon */
        #fs-modal i {
            font-size: 48px;
            color: #007bff;
            margin-bottom: 15px;
        }

        /* Title */
        #fs-modal h4 {
            font-weight: 600;
            margin-bottom: 10px;
        }

        /* Subtitle */
        #fs-modal p {
            color: #555;
            font-size: 15px;
            margin-bottom: 25px;
        }

        /* Fade background */
        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        /* Smooth scale animation */
        @keyframes scaleIn {
            from {
                transform: scale(0.92);
                opacity: 0;
            }

            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    </style>

    <div id="fs-overlay">
        <div id="fs-modal">
            <i class="fas fa-expand-arrows-alt"></i>
            <h4>Enter Fullscreen</h4>
            <p>For a better billing and cart experience, please use the fullscreen mode.</p>
            <button id="fs-confirm-btn" class="btn btn-primary btn-lg px-4" style="border-radius:8px;">
                Enter Fullscreen
            </button>
        </div>
    </div> --}}

    <script>
        // document.getElementById("fs-confirm-btn").addEventListener("click", function() {
        //     const fsButton = document.querySelector('[data-widget="fullscreen"]');

        //     if (fsButton) {
        //         fsButton.click(); // Works because this is a real user click
        //     }

        //     document.getElementById("fs-overlay").remove(); // close popup
        // });
        document.addEventListener('DOMContentLoaded', function() {
            // wait a moment (1s) then click the pushmenu button automatically
            if (!window.location.pathname.startsWith('/admin/cart')) return;
            setTimeout(function() {
                var btn = document.querySelector('#pushmenu-btn') || document.querySelector(
                    '.nav-link[data-widget="pushmenu"]');
                if (btn) btn.click();
            }, 500);
        });
    </script>
@endif
