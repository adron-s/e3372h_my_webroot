/*
 SCRAMJS v1.0.1
 Copyright © 2016 Huawei Technologies Co., Ltd. All rights reserved.
 */
( function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;

    var SHA2    = C_algo.SHA256;
    var HmacSHA2 = C.HmacSHA256;
    var Base = C_lib.Base;

    var SCRAM  = C_algo.SCRAM = Base.extend({
        cfg: Base.extend({
            keySize: 8,
            hasher: SHA2,
            hmac: HmacSHA2
        }),

        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },
        /**
         *  return client nonce
         */
        nonce: function() {
            lastNonce = WordArray.random(this.cfg.keySize * 4);
            return lastNonce;
        },
        /**
         * pbkdf2
         */
        saltedPassword: function(password, salt, iterations) {
            return CryptoJS.PBKDF2(password, salt, {
                keySize: this.cfg.keySize,
                iterations:iterations,
                hasher: this.cfg.hasher
            });
        },
        /**
         *   ClientKey = HMAC(saltPwd, "Client Key")
         */
        clientKey: function(saltPwd) {
            return this.cfg.hmac(saltPwd, "Client Key");
        },
        /**
         *   ServerKey = HMAC(saltPwd, "Server Key")
         */
        serverKey: function(saltPwd) {
            return this.cfg.hmac(saltPwd, "Server Key");
        },
        /**
         *   StoredKey = HASH(ClientKey)
         */
        storedKey: function(clientKey) {
            var hasher = this.cfg.hasher.create();
            hasher.update(clientKey);

            return hasher.finalize();
        },
        /**
         *   Signature = HMAC(StoredKey, AuthMessage)
         */
        signature: function(storedKey, authMessage) {
            return this.cfg.hmac(storedKey, authMessage);
        },
        /**
         *   ClientProof = ClientKey ^ ClientSignature
         */
        clientProof: function (password, salt, iterations, authMessage) {
            var spwd = this.saltedPassword(password, salt, iterations);
            var ckey = this.clientKey(spwd);
            var skey = this.storedKey(ckey);
            var csig = this.signature(skey, authMessage);

            for (var i = 0; i < ckey.sigBytes/4; i += 1) {
                ckey.words[i] = ckey.words[i] ^ csig.words[i]
            }
            return ckey.toString();
        },
        /**
         *   ServerProof = HMAC(ServerKey, AuthMessage)
         */
        serverProof: function (password, salt, iterations, authMessage) {
            var spwd = this.saltedPassword(password, salt, iterations);
            var skey = this.serverKey(spwd);
            var sig = this.signature(skey, authMessage);
            return sig.toString();
        }
    });

    /**
     *   var scram = CryptoJS.SCRAM();
     */
    C.SCRAM = function (cfg) {
        return SCRAM.create(cfg);
    };
}());